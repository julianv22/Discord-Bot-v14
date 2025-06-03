const { ModalBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { setTextInput } = require('../../functions/common/manage-embed');
const reactionMap = new Map();

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
    // const msg = message;
    // const reactionButton = ActionRowBuilder.from(message.components[0]);

    const Reaction = {
      title: async () => await interaction.showModal(reactionModal('Enter the reaction role title')),
      color: async () =>
        await interaction.showModal(reactionModal('Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...')),
      add: async () => {
        if (!reactionMap.has(message.id)) reactionMap.set(message.id, []);
        const emojiArray = reactionMap.get(message.id);

        await interaction.update({
          content: `Vui lòng nhập **emoji và tên role** theo định dạng \`emoji | @tên_role\` (ví dụ: \`👍 | @Thành viên\` hoặc \`:custom_emoji: | @TênRole\`).\nBạn có 5 phút để nhập. Để kết thúc nhập \`Done\``,
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
          emojiArray.push(emojiReact);
          let desc = reactionEmbed.data.description;
          if (desc.includes('🎨Color')) desc = '';
          desc = desc + `\n${emojiReact} | ${role}`;
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

        await interaction.update({ content: 'Done!', embeds: [], components: [] });
        const msg = await channel.send({ embeds: [reactionEmbed] });
        emojiArray.forEach((e) => msg.react(e));

        reactionMap.delete(message.id);
      },
      cancel: async () => {},
    };

    if (typeof Reaction[buttonId] === 'function') await Reaction[buttonId](interaction);
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
