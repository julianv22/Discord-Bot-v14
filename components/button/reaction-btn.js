const { ModalBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { setTextInput } = require('../../functions/common/manage-embed');

module.exports = {
  data: { name: 'reaction-btn' },
  /**
   * Reaction Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { customId, guild, channel, message, user } = interaction;
    const [, buttonId] = customId.split(':');
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);
    const msg = message;
    // const reactionButton = ActionRowBuilder.from(message.components[0]);

    const Reaction = {
      title: async () => await interaction.showModal(reactionModal('Enter the reaction role title')),
      color: async () =>
        await interaction.showModal(reactionModal('Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...')),
      add: async () => {
        await interaction.deferReply({ flags: 64 });
        await interaction.editReply({
          content:
            'Vui lòng nhập **emoji và tên role** theo định dạng `emoji | @tên_role` (ví dụ: `👍 | @Thành viên` hoặc `:custom_emoji: | @TênRole`).\nBạn có 5 phút để nhập. Để kết thúc nhập `Done`',
          flags: 64,
        });

        const filter = (m) => m.author.id === user.id && m.channel.id === channel.id;
        const collector = channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

        let collectedMessage = null;

        collector.on('collect', async (m) => {
          const input = m.content.trim();
          if (m.deletable) await m.delete().catch(console.error);
          if (input === 'done') return collector.stop('finish');

          const [emojiInput, roleInput] = input.split('|').map((v) => v.trim());
          if (!emojiInput || !roleInput)
            return await interaction.followUp({ content: `Nhập sai cú pháp \`emoji | @tên_role\``, flags: 64 });

          let role = null;
          const roleName = roleInput.startsWith('<@&') ? roleInput.substring(3, roleInput.length - 1) : roleInput;
          role = guild.roles.cache.find((r) => r.id === roleName);

          if (!role)
            return await interaction.followUp(
              errorEmbed({
                title: 'Không tìm thấy Role',
                description: `Role \`${roleName}\` không tồn tại, hãy thử lại!`,
                emoji: false,
              }),
            );

          let emojiReact = emojiInput;
          const customEmojiMatch = emojiInput.match(/<(a)?:(\w+):(\d+)>/);
          if (customEmojiMatch) {
            emojiReact = customEmojiMatch[3];
          }

          let desc = reactionEmbed.data.description;
          if (desc.includes('🎨Color')) desc = '';
          desc = desc + `\n${emojiReact} | ${role}`;
          reactionEmbed.setDescription(desc);

          try {
            await msg.edit({ embeds: [reactionEmbed] });
            msg.react(emojiReact);
          } catch (e) {
            console.error('Lỗi khi thêm reaction', e);
            return await interaction.followUp(
              errorEmbed({ title: `\\❌ Lỗi khi thêm reaction`, description: e, color: 'Red' }),
            );
          }
        });

        collector.on('end', async (collected, reason) => {
          if (reason === 'time')
            await interaction.followUp(errorEmbed({ description: 'Hết thời gian nhập', emoji: false }));
        });
      },
      finish: async () => await interaction.update({ components: [] }),
      cancel: async () => await msg.delete().catch(console.error),
    };

    if (typeof Reaction[buttonId] === 'function') return await Reaction[buttonId](interaction);
    /**
     * Create modal
     * @param {string} placeholder - Placeholder
     * @param {string} modalId - Modal ID
     * @param {string} modalTitle - Modal Title
     * @returns {ModalBuilder} - Return ModalBuilder
     */
    function reactionModal(
      placeholder = '',
      modalId = `reaction-md:${buttonId}`,
      modalTitle = `Manager Reaction Role`,
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
