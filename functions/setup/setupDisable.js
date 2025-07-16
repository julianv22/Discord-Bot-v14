const {
  Client,
  Interaction,
  ButtonBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  Colors,
} = require('discord.js');
const { dashboardMenu, textDisplay } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupDisable = async (interaction) => {
    /** - ButtonBuilder
     * @param {string} customId Button customId
     * @param {number} style Button style */
    const button = (customId, style) => {
      const emojis = [, '💡', , '🎉', '⭐'];
      return new ButtonBuilder()
        .setCustomId('disable:' + customId)
        .setLabel(`${emojis[style]} Disable ${customId.toCapitalize()}`)
        .setStyle(style);
    };
    /** - SectionBuilder
     * @param {string} text TextDisplay content
     * @param {string} buttonId Button customId
     * @param {number} style ButtonStyle `1: Primary, 2: Secondary, 3: Success, 4: Danger` */
    const section = (text, buttonId, style) =>
      new SectionBuilder().addTextDisplayComponents(textDisplay(text)).setButtonAccessory(button(buttonId, style));

    const container = new ContainerBuilder()
      .setAccentColor(Colors.Orange)
      .addTextDisplayComponents(textDisplay('### 🚫 Disable Features:'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\⭐ Disable Starboard\n-# Vô hiệu hoá chức năng Starboard', 'starboard', 4))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\💡 Disable Suggest\n-# Vô hiệu hoá chức năng Suggestion', 'suggest', 1))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        section('\\🎉 Disable Welcome System\n-# Vô hiệu hoá chức năng chào mừng thành viên mới', 'welcome', 3)
      );

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
