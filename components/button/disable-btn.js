const { Client, Interaction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { capitalize } = require('../../functions/common/utilities');
module.exports = {
  data: { name: 'disable-btn' },
  /**
   * Disable Features Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    await interaction.deferUpdate();
    const {
      guild,
      customId,
      message: { components: oldComponents },
    } = interaction;
    const { errorEmbed } = client;
    const [, feature, confirm] = customId.split(':');
    const profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});

    if (!profile) return await interaction.reply(errorEmbed(true, 'No database!'));
    // Confirm Button & Cancel Button
    const confirmButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`disable-btn:confirm:${feature}`)
        .setLabel('✅Confirm')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`disable-btn:cancel`).setLabel('❌Cancel').setStyle(ButtonStyle.Danger),
    );
    // Disable Buttons
    const updateRow = new ActionRowBuilder();
    for (const row of oldComponents) {
      const buttons = row.components;
      for (const btn of buttons) {
        const button = ButtonBuilder.from(btn);
        button.setDisabled(true);
        updateRow.addComponents(button);
      }
    }
    /**
     * Confirm Embed
     * @param {String} title - Title of the embed (optional)
     * @param {String} description - Description of the embed (optional)
     * @returns {EmbedBuilder}
     */
    const confirmEmbed = (
      title,
      description = `\\🔴 Bạn có chắc chắn muốn tắt tính năng **${capitalize(feature)}** không?`,
    ) => {
      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setColor('Orange')
        .setDescription(description)
        .setTimestamp();
      if (title) embed.setTitle(title);
      return embed;
    };
    if (feature === 'confirm') {
      const Disable = {
        starboard: () => {
          profile.starboardChannel = '';
          profile.starCount = 0;
        },
        suggest: () => (profile.suggestChannel = ''),
        youtube: () => (profile.youtubeNotifyChannel = ''),
        welcome: () => {
          profile.welcomeChannel = '';
          profile.welcomeMessage = '';
          profile.logChannel = '';
        },
      };
      if (typeof Disable[confirm] === 'function') await Disable[confirm]();
      profile.save().catch(() => {});
      await interaction.editReply({
        embeds: [
          confirmEmbed(
            `\\✅ | Đã tắt tính năng **${capitalize(confirm)}**!`,
            `Click vào \`Dismiss message\` để trở về\n\n\`/setup info\` để xem thông tin cấu hình`,
          ),
        ],
        components: [updateRow],
      });
    } else if (feature === 'cancel') {
      await interaction.editReply({
        embeds: [confirmEmbed(`\\❌ | Đã hủy bỏ!`, `Click vào \`Dismiss message\` để trở về`)],
        components: [updateRow],
      });
    } else await interaction.editReply({ embeds: [confirmEmbed()], components: [confirmButton] });
  },
};
