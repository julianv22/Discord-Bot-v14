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
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupDisable = async (interaction) => {
    /** - Button Components
     * @param {string} customId Button customId
     * @param {ButtonStyle} style Button style */
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

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
