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
const { disableButtons } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'disable-btn' },
  /** - Disable Features Button
   * @param {ChatInputCommandInteraction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guild,
      customId,
      message: { components: oldComponents },
    } = interaction;
    const { errorEmbed } = client;
    const [, feature, confirm] = customId.split(':');

    const profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

    if (!profile) {
      return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy dữ liệu máy chủ trong cơ sở dữ liệu!' }));
    }

    const { starboard, suggest, youtube, welcome } = profile.setup;
    // Confirm Button & Cancel Button
    const confirmButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`disable-btn:confirm:${feature}`)
        .setLabel('✅Confirm')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('disable-btn:cancel').setLabel('❌Cancel').setStyle(ButtonStyle.Danger)
    );
    /** - Confirm Embed
     * @param {string} title Embed title
     * @param {string} [description] Embed description (optional) */
    const createConfirmEmbed = (
      title,
      description = `🔴 Bạn có chắc chắn muốn tắt tính năng **${feature.toCapitalize()}** không?`,
      color = Colors.Orange
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

    switch (feature) {
      case 'confrm': {
        const disableFeature = async () => {
          switch (confirm) {
            case 'starboard':
              profile.setup.starboard.channel = '';
              profile.setup.starboard.star = 0;
              break;
            case 'suggest':
              profile.setup.suggest = '';
              break;
            case 'youtube':
              profile.setup.youtube.notifyChannel = '';
              break;
            case 'welcome':
              profile.setup.welcome.channel = '';
              profile.setup.welcome.log = '';
              break;
            default:
              throw new Error(chalk.yellow("Invalid feature's customId ") + chalk.green(confirm));
          }
          await profile.save().catch(console.error);
        };

        await disableFeature();

        await interaction.update({
          embeds: [
            createConfirmEmbed(
              `\\✅ Đã tắt tính năng **${confirm.toCapitalize()}**!`,
              `Click vào \`Dismiss message\` để trở về\n\n\`/setup info\` để xem thông tin cấu hình`,
              Colors.Green
            ),
          ],
          components: [disableButtons(oldComponents)],
        });
        break;
      }
      case 'cancel':
        await interaction.update({
          embeds: [
            createConfirmEmbed('\\❌ Đã hủy bỏ!', 'Click vào `Dismiss message` để trở về', Colors.DarkVividPink),
          ],
          components: [disableButtons(oldComponents)],
        });
        break;
      default:
        await interaction.update({ embeds: [createConfirmEmbed()], components: [confirmButton] });
        break;
    }
  },
};
