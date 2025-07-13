const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  MessageFlags,
  Colors,
} = require('discord.js');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('disable'),
  /** - Disables various features on the server.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    /** @param {string} content TextDisplay content */
    const textdisplay = (content) => new TextDisplayBuilder().setContent(content);
    /** - ButtonBuilder
     * @param {string} customId Button customId
     * @param {number} style Button style */
    const button = (customId, style) => {
      const emojis = [, '⭐', '💡', '🎉', '🎬'];
      return new ButtonBuilder()
        .setCustomId('disable:' + customId)
        .setLabel(`${emojis[style]} Disable ${customId.toCapitalize()}`)
        .setStyle(style === 2 ? 1 : style);
    };
    /** - SectionBuilder
     * @param {string} text TextDisplay content
     * @param {string} buttonId Button customId
     * @param {number} style ButtonStyle */
    const section = (text, buttonId, style) =>
      new SectionBuilder().addTextDisplayComponents(textdisplay(text)).setButtonAccessory(button(buttonId, style));

    const container = new ContainerBuilder()
      .setAccentColor(Colors.Orange)
      .addTextDisplayComponents(textdisplay('### Disable Features:'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\⭐ Disable Starboard\n-# Vô hiệu hoá chức năng Starboard', 'starboard', 1))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\💡 Disable Suggest Channel\n-# Vô hiệu hoá chức năng Suggestion', 'suggest', 2))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        section('\\🎬 Disable Youtube Notify\n-# Vô hiệu hoá chức năng thông báo video mới trên YouTube', 'youtube', 4)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        section('\\🎉 Disable Welcome System\n-# Vô hiệu hoá chức năng chào mừng thành viên mới', 'welcome', 3)
      );

    await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] });
  },
};
