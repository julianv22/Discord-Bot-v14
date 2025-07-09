const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  TextDisplayBuilder,
  ButtonBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  ButtonStyle,
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
    /** - TextDisplayBuilder
     * @param {string} content TextDisplay content */
    const textDisplay = (content) => new TextDisplayBuilder().setContent(content);
    /** - ButtonBuilder
     * @param {string} emoji Button emoji
     * @param {string} customId Button customId
     * @param {ButtonStyle} style ButtonStyle */
    const button = (customId, style) => {
      const emojis = [, '⭐', '💡', '🎉', '🎬'];

      return new ButtonBuilder()
        .setCustomId(`disable-btn:${customId}`)
        .setLabel(`${emojis[style]} Disable ${customId.toCapitalize()}`)
        .setStyle(style === 2 ? 1 : style);
    };
    /** - SectionBuilder
     * @param {string} text TextDisplay content
     * @param {string} buttonId Button customId
     * @param {ButtonStyle} style ButtonStyle */
    const section = (text, buttonId, style) => {
      return new SectionBuilder()
        .addTextDisplayComponents(textDisplay(text))
        .setButtonAccessory(button(buttonId, style));
    };

    const container = new ContainerBuilder()
      .setAccentColor(Colors.Orange)
      .addTextDisplayComponents(textDisplay('### Disable Features:'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\⭐ Disable Starboard\n-# Tắt chức năng Starboard', 'starboard', 1))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(section('\\💡 Disable Suggest Channel\n-# Tắt chức năng Suggestion', 'suggest', 2))
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        section('\\🎬 Disable Youtube Notify\n-# Tắt chức năng thông báo video mới trên YouTube', 'youtube', 4)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(
        section('\\🎉 Disable Welcome System\n-# Tắt chức năng chào mừng thành viên mới', 'welcome', 3)
      );

    await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] });
  },
};
