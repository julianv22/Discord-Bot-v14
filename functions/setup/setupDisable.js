const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ButtonStyle,
  Colors,
} = require('discord.js');
const { dashboardMenu, textDisplay, sectionComponents } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the disable features menu.
   * @param {Interaction} interaction - The command interaction. */
  client.setupDisable = async (interaction) => {
    /** - Creates a button component for disabling features.
     * @param {string} customId - The custom ID for the button.
     * @param {ButtonStyle} style - The style of the button. */
    const button = (customId, style) => {
      const emojis = [, '💡', , '🎉', '⭐'];
      return { customId: 'disable:' + customId, label: `${emojis[style]} Disable ${customId.toCapitalize()}`, style };
    };

    const container = new ContainerBuilder()
      .setAccentColor(Colors.Orange)
      .addTextDisplayComponents(textDisplay('### ⛔ Disable Features:'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          ['\\⭐ Disable Starboard', '-# Vô hiệu hoá chức năng Starboard'],
          ComponentType.Button,
          button('starboard', ButtonStyle.Danger)
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          ['\\💡 Disable Suggest', '-# Vô hiệu hoá chức năng Suggestion'],
          ComponentType.Button,
          button('suggest', ButtonStyle.Primary)
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        sectionComponents(
          ['\\🎉 Disable Welcome System', '-# Vô hiệu hoá chức năng chào mừng thành viên mới'],
          ComponentType.Button,
          button('welcome', ButtonStyle.Success)
        )
      );

    await interaction.editReply({ components: [dashboardMenu('disable'), container] });
  };
};
