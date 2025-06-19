const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { capitalize } = require('../../functions/common/utilities');
const { disableButtons } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'disable-btn' },
  /** Disable Features Button
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guild,
      customId,
      message: { components: oldComponents },
    } = interaction;
    const { errorEmbed, catchError } = client;
    const [, feature, confirm] = customId.split(':');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

      if (!profile) return await interaction.reply(errorEmbed({ desc: 'No database!', emoji: false }));

      const { starboard, suggest, youtube, welcome } = profile.setup;
      // Confirm Button & Cancel Button
      const confirmButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`disable-btn:confirm:${feature}`)
          .setLabel('✅Confirm')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('disable-btn:cancel').setLabel('❌Cancel').setStyle(ButtonStyle.Danger),
      );
      /**
       * Confirm Embed
       * @param {string} title - Title of the embed (optional)
       * @param {string} description - Description of the embed (optional)
       * @returns {EmbedBuilder} - Return EmbedBuilder
       */
      const confirmEmbed = (
        title,
        description = `🔴 Bạn có chắc chắn muốn tắt tính năng **${capitalize(feature)}** không?`,
        color = Colors.Orange,
      ) => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setColor(color)
          .setDescription(description);
        if (title) {
          embed.setTitle(title).setTimestamp();
        }
        return embed;
      };

      if (feature === 'confirm') {
        const Disable = {
          starboard: () => {
            starboard.channel = '';
            starboard.star = 0;
            return;
          },
          suggest: () => {
            suggest = '';
            return;
          },
          youtube: () => {
            youtube.notifyChannel = '';
            return;
          },
          welcome: () => {
            welcome.channel = '';
            welcome.log = '';
            return;
          },
        };

        if (!Disable[confirm]) throw new Error(chalk.yellow("Invalid feature's customId ") + chalk.green(confirm));
        else await Disable[confirm]();

        await profile.save().catch(console.error);
        return await interaction.update({
          embeds: [
            confirmEmbed(
              `\\✅ Đã tắt tính năng **${capitalize(confirm)}**!`,
              `Click vào \`Dismiss message\` để trở về\n\n\`/setup info\` để xem thông tin cấu hình`,
              'Green',
            ),
          ],
          components: [disableButtons(oldComponents)],
        });
      } else if (feature === 'cancel') {
        return await interaction.update({
          embeds: [confirmEmbed('\\❌ Đã hủy bỏ!', 'Click vào `Dismiss message` để trở về', 'Red')],
          components: [disableButtons(oldComponents)],
        });
      } else await interaction.update({ embeds: [confirmEmbed()], components: [confirmButton] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
