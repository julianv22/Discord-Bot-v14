const { Client, ModalBuilder, TextInputStyle, EmbedBuilder, Colors } = require('discord.js');
const reactionRole = require('../../config/reactionRole');
const { setTextInput } = require('../../functions/common/components');
const reactionMap = new Map();

module.exports = {
  data: { name: 'reaction-btn' },
  /**
   * Reaction Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { customId, guild, channel, message, user } = interaction;
    const { errorEmbed, catchError } = client;
    const [, buttonId] = customId.split(':');
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);

    try {
      const Reaction = {
        title: async () => await interaction.showModal(reactionModal('Enter the reaction role title')),
        color: async () => await interaction.showModal(reactionModal(Object.keys(Colors).join(',').slice(14, 114))),
        add: async () => {
          if (!reactionMap.has(message.id)) reactionMap.set(message.id, []);
          const emojiArray = reactionMap.get(message.id);

          await interaction.update({
            content:
              'Vui lòng nhập **emoji và tên role** theo định dạng `emoji | @tên_role` (ví dụ: `👍 | @Tên_Role` hoặc `:custom_emoji: | @Tên_Role`).\nBạn có 5 phút để nhập. Để kết thúc nhập `Done`',
          });

          const filter = (m) => m.author.id === user.id && m.channel.id === channel.id;
          const collector = channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

          collector.on('collect', async (m) => {
            const input = m.content.trim();
            if (m && m.deletable) await m.delete().catch(console.error);
            if (input === 'done') {
              collector.stop('finish');
              return interaction.followUp(errorEmbed({ description: 'Kết thúc thêm reaction role!', emoji: true }));
            }

            const [emojiInput, roleInput] = input.split('|').map((v) => v.trim());
            if (!emojiInput || !roleInput)
              return await interaction.followUp({ content: 'Nhập sai cú pháp `emoji | @tên_role`', flags: 64 });

            let role = roleInput;
            try {
              const roleMatch = roleInput.match(/^<@&(\d+)>$/);
              const roleId = roleMatch ? roleMatch[1] : null;

              if (roleId) role = await guild.roles.cache.get(roleId);
              else role = await guild.roles.cache.find((r) => r.name.toLowerCase() === roleInput.toLowerCase());

              if (!role)
                return await interaction.followUp(
                  errorEmbed({
                    title: '\\❌ Không tìm thấy Role',
                    description: `Role \`${roleInput}\` không tồn tại, hãy thử lại!`,
                    color: Colors.Red,
                  }),
                );
            } catch (e) {
              return console.error(chalk.red('Error while fetching role\n'), e);
            }

            let emojiReact = emojiInput;
            const emojiMatch = emojiInput.match(/<(a)?:(\w+):(\d+)>/);
            if (emojiMatch) {
              emojiReact = `<${emojiMatch[1] ? 'a' : ''}:${emojiMatch[2]}:${emojiMatch[3]}>`;

              if (!client.emojis.cache.get(emojiMatch[3]))
                return interaction.followUp(
                  errorEmbed({ description: `Bot không truy cập được custom emoji: ${emojiInput}` }),
                );
            }

            let desc = reactionEmbed.data.description || '';
            if (desc.includes('🎨Color')) desc = '';
            desc = desc + `\n${emojiReact} ${role}`;

            emojiArray.push({ emoji: emojiReact, roleId: role.id });

            reactionEmbed.setDescription(desc);

            await interaction.editReply({ content: '', embeds: [reactionEmbed] });
          });

          collector.on('end', async (collected, reason) => {
            if (reason === 'time')
              await interaction.followUp(errorEmbed({ description: 'Hết thời gian nhập', emoji: false }));
          });
        },
        finish: async () => {
          const emojiArray = reactionMap.get(message.id) || [];

          if (emojiArray.length <= 0)
            return interaction.reply(errorEmbed({ description: 'Thêm ít nhất một role!', emoji: false }));

          const msg = await channel.send({ embeds: [reactionEmbed] });

          await reactionRole
            .create({
              guildID: guild.id,
              guildName: guild.name,
              channelId: channel.id,
              messageId: msg.id,
              title: reactionEmbed.data.title,
              description: reactionEmbed.data.description,
              roles: emojiArray,
            })
            .catch(console.error);

          await interaction.update({
            ...errorEmbed({
              description: `Reaction role đã được tạo: [Jump Link](${msg.url})`,
              emoji: true,
            }),
            components: [],
          });

          await Promise.all(emojiArray.map(async (e) => await msg.react(e.emoji))).catch(console.error);

          reactionMap.delete(message.id);
        },
      };

      if (typeof Reaction[buttonId] === 'function') await Reaction[buttonId](interaction);
    } catch (e) {
      catchError(interaction, e, this);
    }
    /**
     * Create modal
     * @param {String} placeholder - Placeholder
     * @param {String} modalId - Modal ID
     * @param {String} modalTitle - Modal Title
     * @returns {ModalBuilder} - Return ModalBuilder
     */
    function reactionModal(
      placeholder = '',
      modalId = `reaction-md:${buttonId}`,
      modalTitle = 'Manager Reaction Role',
    ) {
      return new ModalBuilder()
        .setCustomId(modalId)
        .setTitle(modalTitle)
        .setComponents(
          setTextInput({
            id: buttonId,
            label: `Reaction Role ${buttonId}`,
            style: TextInputStyle.Short,
            placeholder: placeholder,
          }),
        );
    }
  },
};
