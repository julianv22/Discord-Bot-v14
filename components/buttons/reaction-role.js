const { Client, Interaction, ActionRowBuilder, EmbedBuilder, ButtonStyle, Colors } = require('discord.js');
const reactionRole = require('../../config/reactionRole');
const { createModal, linkButton } = require('../../functions/common/components');
const reactionMap = new Map();

module.exports = {
  type: 'buttons',
  data: { name: 'reaction-role' },
  /** - Reaction Button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      customId,
      guild,
      guildId,
      guild: { name: guildName },
      channel,
      message,
      user,
    } = interaction;
    const { errorEmbed } = client;
    const [, buttonId] = customId.split(':');
    const buttons = ActionRowBuilder.from(message.components[0]);
    const hideButton = buttons.components[0];
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);

    const reactionButton = {
      title: async () =>
        await createModal(interaction, `manage-embed:${buttonId}`, 'Reaction Role Manager', {
          customId: buttonId,
          label: `Reaction Role ${buttonId} (Leave blank = Remove)`,
          placeholder: `Enter the Reaction Role ${buttonId}`,
          max_length: 256,
        }),
      color: async () =>
        createModal(interaction, `manage-embed:${buttonId}`, 'Reaction Role Manager', {
          customId: buttonId,
          label: `Reaction Role ${buttonId} (Leave blank = Random)`,
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
        }),
      add: async () => {
        if (!reactionMap.has(message.id)) reactionMap.set(message.id, []);

        const emojiArray = reactionMap.get(message.id);
        reactionEmbed.setFields();
        hideButton.setLabel('✅ Show guide').setStyle(ButtonStyle.Primary);

        await interaction.update({
          embeds: [
            reactionEmbed.addFields(
              {
                name: 'Vui lòng nhập **emoji và tên role** theo định dạng `emoji | @tên_role`',
                value: '-# Ví dụ: `👍 | @Tên_Role` hoặc `:custom_emoji: | @Tên_Role`',
              },
              { name: 'Bạn có 15 phút để nhập', value: '-# Để kết thúc nhập `Done`' }
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
            return interaction.followUp(errorEmbed({ desc: 'Kết thúc thêm reaction role!', emoji: true }));
          }

          const [emojiInput, roleInput] = input.split('|').map((v) => v.trim());
          if (!emojiInput || !roleInput)
            return await interaction.followUp({ content: 'Nhập sai cú pháp `emoji | @tên_role`', flags: 64 });

          let role;
          try {
            const roleMatch = roleInput.match(/^<@&(\d+)>$/);
            const roleId = roleMatch ? roleMatch[1] : null;

            if (roleId) role = guild.roles.cache.get(roleId);
            else role = guild.roles.cache.find((r) => r.name.toLowerCase() === roleInput.toLowerCase());

            if (!role)
              return await interaction.followUp(errorEmbed({ desc: `Role ${roleInput} không tồn tại, hãy thử lại!` }));
          } catch (e) {
            return client.catchError(interaction, e, 'Lỗi khi tìm kiếm role');
          }

          let emojiReact = emojiInput;
          const emojiMatch = emojiInput.match(/<(a)?:(\w+):(\d+)>/);
          if (emojiMatch) {
            emojiReact = `<${emojiMatch[1] ? 'a' : ''}:${emojiMatch[2]}:${emojiMatch[3]}>`;

            if (!client.emojis.cache.get(emojiMatch[3]))
              return interaction.followUp(errorEmbed({ desc: `Bot không truy cập được custom emoji: ${emojiInput}` }));
          }

          let desc = reactionEmbed.data.description || '';
          desc = desc + `\n${emojiReact} ${role}`;

          emojiArray.push({ emoji: emojiReact, roleId: role.id });

          reactionEmbed.setDescription(desc);

          await interaction.editReply({ embeds: [reactionEmbed] });
        });

        collector.on('end', async (collected, reason) => {
          if (reason === 'time') await interaction.followUp(errorEmbed({ desc: 'Hết thời gian nhập' }));
        });
      },
      hide: async () => {
        if (hideButton.data.label === '⛔ Hide guide') {
          hideButton.setLabel('✅ Show guide').setStyle(ButtonStyle.Primary);
          reactionEmbed.setFields();
        } else {
          hideButton.setLabel('⛔ Hide guide').setStyle(ButtonStyle.Danger);
          reactionEmbed.setFields(
            { name: '\\💬 Title', value: 'Reaction role title.\n-# Vui lòng tạo role trước khi thêm reaction role.' },
            {
              name: '➕ Add Role',
              value: 'Thêm role vào reaction role\n-# **Lưu ý:** Bạn có thể thêm nhiều role vào một reaction role.',
            },
            { name: '\\🎨 Color', value: '```fix\n' + Object.keys(Colors).join(', ') + '```' }
          );
        }

        await interaction.update({ embeds: [reactionEmbed], components: [buttons] });
      },
      finish: async () => {
        const emojiArray = reactionMap.get(message.id) || [];

        if (emojiArray.length === 0) return await interaction.reply(errorEmbed({ desc: 'Thêm ít nhất một role!' }));

        const msg = await channel.send({ embeds: [reactionEmbed.setFields()] });
        await Promise.all(emojiArray.map(async (e) => await msg.react(e.emoji))).catch(console.error);

        await interaction.update({
          ...errorEmbed({ desc: 'Reaction role đã được tạo', emoji: true }),
          components: [linkButton(msg.url)],
        });

        await reactionRole
          .findOneAndUpdate(
            { guildId, messageId: msg.id },
            {
              $setOnInsert: {
                channelId: channel.id,
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

    if (!reactionButton[buttonId]()) throw new Error(chalk.yellow('Invalid buttonId'), chalk.green(buttonId));
  },
};
