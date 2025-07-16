const {
  Client,
  Interaction,
  ActionRowBuilder,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { rowComponents, dashboardMenu, textDisplay } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'disable' },
  /** - Disable Features Button
   * @param {Interaction} interaction Button Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { guildId: guildID, customId } = interaction;
    const [, feature, disable] = customId.split(':');

    /** @param {boolean} [disabled] Disabled buttons, `true` = disabled */
    const confirmButtons = (disabled = false) =>
      new ActionRowBuilder().setComponents(
        rowComponents(
          [
            { customId: 'disable:confirm:' + feature, label: '✅ Confirm', style: ButtonStyle.Success, disabled },
            { customId: 'disable:cancel', label: '❌ Cancel', style: ButtonStyle.Danger, disabled },
          ],
          ComponentType.Button
        )
      );
    /** - ContainerBuilder
     * @param {string|string[]} contents TextDisplay content
     * @param {num} [accent_color] Container accent color */
    const containerMessage = (contents, accent_color = Colors.Orange) =>
      new ContainerBuilder().setAccentColor(accent_color).addTextDisplayComponents(textDisplay(contents));

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);

    if (!profile)
      return await interaction.update({
        components: [containerMessage('\\❌ Không tìm thấy dữ liệu máy chủ trong cơ sở dữ liệu!', Colors.Red)],
      });

    const { starboard, suggest, youtube, welcome } = profile?.setup || {};

    const onClick = {
      default: async () =>
        await interaction.update({
          components: [
            dashboardMenu(),
            containerMessage([
              `**Disable ${feature.toCapitalize()}**`,
              `-# Vô hiệu hoá chức năng ${feature.toCapitalize()}`,
              '-# Click `✅ Confirm` để xác nhận \\⤵️',
            ]),
            confirmButtons(),
          ],
        }),
      cancel: async () =>
        await interaction.update({
          components: [
            dashboardMenu(),
            containerMessage(`\\❌ ${feature.toCapitalize()} Disable`, Colors.Red),
            confirmButtons(true),
          ],
        }),
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
            youtube.alert = '';
            break;
          case 'welcome':
            welcome.channel = '';
            welcome.log = '';
            break;
          default:
            throw new Error(chalk.yellow("Invalid feature's customId"), chalk.green(disable));
        }

        await profile.save().catch(console.error);

        return await interaction.update({
          components: [
            dashboardMenu(),
            containerMessage(
              [
                `**\\✅ Disable ${disable.toCapitalize()} successfully!**`,
                `-# Đã vô hiệu hoá chức năng ${disable.toCapitalize()} thành công.`,
              ],
              Colors.Green
            ),
          ],
        });
      },
    };

    (onClick[feature] || onClick.default)();
  },
};
