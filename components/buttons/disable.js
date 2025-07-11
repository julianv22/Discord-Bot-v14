const {
  Client,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'disable-' },
  /** - Disable Features Button
   * @param {ButtonInteraction} interaction Button Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { guildId: guildID, customId } = interaction;
    const [, feature, disable] = customId.split(':');

    /** @param {boolean} [disabled] Disabled buttons, `true` = disabled */
    const confirmButtons = (disabled = false) =>
      new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setCustomId('disable-:confirm:' + feature)
          .setLabel('✅ Confirm')
          .setStyle(ButtonStyle.Success)
          .setDisabled(disabled),
        new ButtonBuilder()
          .setCustomId('disable-:cancel')
          .setLabel('❌ Cancel')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(disabled)
      );
    /** - ContainerBuilder
     * @param {string} content TextDisplay content
     * @param {num} [accent_color] Container accent color */
    const container = (content, accent_color = Colors.Orange) =>
      new ContainerBuilder()
        .setAccentColor(accent_color)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(content));

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);

    if (!profile)
      return await interaction.update({
        components: [container('\\❌ Không tìm thấy dữ liệu máy chủ trong cơ sở dữ liệu!', Colors.Red)],
      });

    const { starboard, suggest, youtube, welcome } = profile?.setup;

    const onClick = {
      default: async () => {
        return await interaction.update({
          components: [
            container(
              `**Disable ${feature.toCapitalize()}**\n-# Vô hiệu hoá chức năng ${feature.toCapitalize()}\n\n-# Click \`✅ Confirm\` để xác nhận \\⤵️`
            ),
            confirmButtons(),
          ],
        });
      },
      cancel: async () => {
        return await interaction.update({
          components: [
            container(`**Disable ${feature}**\n-# Click  \`Dismiss message\` to return`),
            confirmButtons(true),
          ],
        });
      },
      confirm: async () => {
        switch (disable) {
          case 'starboard':
            starboard.channel = '';
            starboard.star = 0;
            break;
          case 'suggest':
            suggest = '';
            break;
          case 'youtube':
            youtube.notifyChannel = '';
            break;
          case 'welcome':
            welcome.channel = '';
            welcome.log = '';
            break;
          default:
            throw new Error(chalk.yellow("Invalid feature's customId ") + chalk.green(disable));
        }

        await profile.save().catch(console.error);

        return await interaction.update({
          components: [
            container(
              `**\\✅ Disable ${disable.toCapitalize()} successfully!**\n-# Đã vô hiệu hoá chức năng ${disable.toCapitalize()} thành công.`,
              Colors.Green
            ),
          ],
        });
      },
    };

    (onClick[feature] || onClick.default)();
  },
};
