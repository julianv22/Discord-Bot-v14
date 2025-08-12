const { Client, Interaction, ActionRowBuilder, EmbedBuilder, ButtonStyle, Colors } = require('discord.js');
const reactionRole = require('../../config/reactionRole');
const { createModal, linkButton } = require('../../functions/common/components');
const { embedMessage } = require('../../functions/common/logging');
const reactionMap = new Map();

module.exports = {
  type: 'buttons',
  data: { name: 'reaction-role' },
  /** Handles the reaction role button interaction.
   * @param {Interaction} interaction The button interaction.
   * @param {Client} client The Discord client. */
  async execute(interaction, client) {
    const { guild, guildId, channel, message, user, customId } = interaction;
    const [, buttonId] = customId.split(':');
    const buttons = ActionRowBuilder.from(message.components[0]);
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);

    const reactionButton = {
      title: async () =>
        await createModal(interaction, `manage-message:${buttonId}`, 'Reaction Role Manager', {
          customId: buttonId,
          label: `Reaction Role ${buttonId} (Leave blank = Remove)`,
          placeholder: `Enter the Reaction Role ${buttonId}`,
          maxLength: 256,
        }),
      color: async () =>
        await createModal(interaction, `manage-message:${buttonId}`, 'Reaction Role Manager', {
          customId: buttonId,
          label: `Reaction Role ${buttonId} (Leave blank = Random)`,
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
          maxLength: 256,
        }),
      add: async () => {
        await interaction.deferUpdate();

        if (!reactionMap.has(message.id)) reactionMap.set(message.id, []);

        const emojiArray = reactionMap.get(message.id);
        reactionEmbed.setFields();
        hideButton.setLabel('✅ Show guide').setStyle(ButtonStyle.Primary);

        await interaction.editReply({
          embeds: [
            reactionEmbed.addFields(
              {
                name: 'Please enter **emoji** and **role name** in the format `emoji | @RoleName`',
                value: '-# Example: `👍 | @RoleName` or `:custom_emoji: | @RoleName`',
              },
              { name: 'You have 15 minutes to enter', value: '-# To finish, type `Done`' }
            ),
          ],
          components: [buttons],
        });

        const filter = (m) => m.author.id === user.id && m.channel.id === channel.id;
        const collector = channel.createMessageCollector({ filter, time: 15 * 60 * 1000 });

        collector.on('collect', async (m) => {
          const input = m.content.trim();
          if (m && m.deletable) await m.delete().catch(console.error);

          if (input.toLowerCase() === 'done') {
            collector.stop('finish');
            hideButton.setLabel('✅ Show guide').setStyle(ButtonStyle.Primary);
            await interaction.editReply({ embeds: [reactionEmbed.setFields()], components: [buttons] });
            return interaction.followUp(embedMessage({ desc: 'Finished adding reaction roles!', emoji: true }));
          }

          const [emojiInput, roleInput] = input.split('|').map((v) => v.trim());
          if (!emojiInput || !roleInput)
            return await interaction.followUp(embedMessage({ title: 'Incorrect format', desc: '`emoji | @RoleName`' }));

          let role;
          try {
            const roleMatch = roleInput.match(/^<@&(\d+)>$/);
            const roleId = roleMatch ? roleMatch[1] : null;

            if (roleId) role = guild.roles.cache.get(roleId);
            else role = guild.roles.cache.find((r) => r.name.toLowerCase() === roleInput.toLowerCase());

            if (!role)
              return await interaction.followUp(
                embedMessage({ desc: `Role ${roleInput} does not exist, please try again!` })
              );
          } catch (e) {
            return await client.catchError(interaction, e, 'Error searching for role');
          }

          let emojiReact = emojiInput;
          const emojiMatch = emojiInput.match(/<(a)?:(\w+):(\d+)>/);
          if (emojiMatch) {
            emojiReact = `<${emojiMatch[1] ? 'a' : ''}:${emojiMatch[2]}:${emojiMatch[3]}>`;

            if (!client.emojis.cache.get(emojiMatch[3]))
              return await interaction.followUp(
                embedMessage({ desc: `Bot cannot access custom emoji: ${emojiInput}` })
              );
          }

          let desc = reactionEmbed.data.description || '';
          desc = desc + `\n${emojiReact} ${role}`;

          emojiArray.push({ emoji: emojiReact, roleId: role.id });

          reactionEmbed.setDescription(desc);

          await interaction.editReply({ embeds: [reactionEmbed] });
        });

        collector.on('end', async (collected, reason) => {
          if (reason === 'time') await interaction.followUp(embedMessage({ desc: 'Input time expired' }));
        });
      },
      hide: async () => {
        await interaction.deferUpdate();
        const hideButton = buttons.components[0];

        if (hideButton.data.label === '⛔ Hide guide') {
          hideButton.setLabel('✅ Show guide').setStyle(ButtonStyle.Primary);
          reactionEmbed.setFields();
        } else {
          hideButton.setLabel('⛔ Hide guide').setStyle(ButtonStyle.Danger);
          reactionEmbed.setFields(
            { name: '\\💬 Title', value: 'Reaction role title.\n-# Vui lòng tạo role trước khi thêm reaction role.' },
            {
              name: '\\➕ Add Role',
              value: 'Add roles to the reaction role\n-# **Lưu ý:** Bạn có thể thêm nhiều role vào một reaction role.',
            },
            { name: '\\🎨 Color', value: '```fix\n' + Object.keys(Colors).join(', ') + '```' }
          );
        }

        await interaction.editReply({ embeds: [reactionEmbed], components: [buttons] });
      },
      finish: async () => {
        const emojiArray = reactionMap.get(message.id) || [];

        if (emojiArray.length === 0)
          return await interaction.reply(embedMessage({ desc: 'Please add at least one role!' }));

        const msg = await channel.send({ embeds: [reactionEmbed.setFields()] });
        await Promise.all(emojiArray.map(async (e) => await msg.react(e.emoji))).catch(console.error);

        await interaction.update({
          ...embedMessage({ desc: 'Reaction role created successfully', emoji: true }),
          components: [linkButton(msg.url)],
        });

        await reactionRole
          .findOneAndUpdate(
            { guildId, messageId: msg.id },
            {
              $setOnInsert: {
                guildName: guild.name,
                channelId: channel.id,
                channelName: channel.name,
                title: reactionEmbed.data.title,
                description: reactionEmbed.data.description,
                roles: emojiArray,
              },
            },
            { upsert: true, new: true }
          )
          .catch(console.error);

        reactionMap.delete(message.id);
      },
    };

    if (!reactionButton[buttonId]()) throw new Error(chalk.yellow('Invalid button ID'), chalk.green(buttonId));
  },
};
