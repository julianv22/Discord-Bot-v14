const {
  Client,
  Interaction,
  ActionRowBuilder,
  ContainerBuilder,
  ButtonStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { rowComponents, dashboardMenu, textDisplay } = require('../../functions/common/components');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  type: 'buttons',
  data: { name: 'disable' },
  /** - Disable Features Button
   * @param {Interaction} interaction Button Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guildId, customId } = interaction;
    const [, feature, disable] = customId.split(':');

    /** @param {boolean} [disabled = false] Disabled buttons, `true` = disabled */
    const confirmButtons = (disabled = false) =>
      new ActionRowBuilder().setComponents(
        rowComponents(ComponentType.Button, [
          { customId: 'disable:confirm:' + feature, label: '✅ Confirm', style: ButtonStyle.Success, disabled },
          { customId: 'disable:cancel', label: '❌ Cancel', style: ButtonStyle.Danger, disabled },
        ])
      );

    /** - ContainerBuilder
     * @param {string|string[]} contents TextDisplay content
     * @param {num} [accent_color = Colors.Orange] Container accent color */
    const messageContainer = (contents, accent_color = Colors.Orange) =>
      new ContainerBuilder().setAccentColor(accent_color).addTextDisplayComponents(textDisplay(contents));

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    if (!profile)
      return interaction.followUp(embedMessage({ desc: 'No data found for this server. Please try again later!' }));

    const { starboard, suggest, youtube, welcome } = profile || {};

    const onClick = {
      default: async () =>
        await interaction.editReply({
          components: [
            dashboardMenu(),
            messageContainer([
              `**Disable ${feature.toCapitalize()}**`,
              `-# Vô hiệu hoá chức năng ${feature.toCapitalize()}`,
              '-# Click `✅ Confirm` để xác nhận \\⤵️',
            ]),
            confirmButtons(),
          ],
        }),
      cancel: async () =>
        await interaction.editReply({
          components: [
            dashboardMenu(),
            messageContainer(`\u274C\uFE0F ${feature.toCapitalize()} Disable`, Colors.Red),
            confirmButtons(true),
          ],
        }),
      confirm: async () => {
        switch (disable) {
          case 'starboard':
            starboard.channelId = '';
            starboard.starCount = 0;
            break;
          case 'suggest':
            suggest.channelId = '';
            break;
          case 'youtube':
            youtube.notifyChannelId = '';
            youtube.alertRoleId = '';
            break;
          case 'welcome':
            welcome.channelId = '';
            welcome.logChannelId = '';
            break;
          default:
            throw new Error(chalk.yellow("Invalid feature's customId"), chalk.green(disable));
        }

        await profile.save().catch(console.error);

        await interaction.editReply({
          components: [
            dashboardMenu(),
            messageContainer(
              [
                `**\u2705\uFE0F Disable ${disable.toCapitalize()} successfully!**`,
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
