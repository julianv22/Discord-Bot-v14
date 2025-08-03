const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  type: 'menus',
  data: { name: 'help-menu' },
  /** - Help Menu
   * @param {Interaction} interaction - The select menu interaction.
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guild, user, message, values } = interaction;
    const { slashCommands, subCommands, prefixCommands } = client;
    const selectedCommand = values[0];
    const { components } = message;

    const menuOptions = components[0].components[0].options;
    menuOptions.map((option) => (option.default = option.value === selectedCommand));

    const ignore = 'context menu';
    const slashCategories = [
      ...new Set(
        slashCommands.filter((cmd) => !ignore.includes(cmd.category)).map((cmd) => cmd.category.toCapitalize())
      ),
    ];
    const subCategories = [...new Set(subCommands.map((cmd) => cmd.parent.toCapitalize()))];
    const contextMenus = slashCommands.filter((cmd) => cmd.category === ignore).map((cmd) => cmd.data.name);
    const commands = slashCommands.listCommandsAndSubs(selectedCommand);

    const showHelp = {
      prefix: () => [
        new EmbedBuilder()
          .setColor(Colors.DarkGreen)
          .setThumbnail(cfg.helpPNG)
          .setAuthor({ name: guild.name, iconURL: cfg.book_gif })
          .setTitle(`📝 Prefix Commands [\`${prefix}\`] List`)
          .setDescription(
            `If you need more help, join my support server: [\`${cfg.supportServer}\`](${cfg.supportLink})`
          )
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields(
            { name: `Total commands: [${prefixCommands.size}]`, value: `Command prefix: [\`${prefix}\`]` },
            ...prefixCommands.listCommands(),
            { name: `\u200b`, value: `\`${prefix}command ?\` to show more details` }
          ),
      ],
      slash: () => [
        new EmbedBuilder()
          .setColor(Colors.DarkGreen)
          .setThumbnail(cfg.slashPNG)
          .setAuthor({ name: guild.name, iconURL: cfg.book_gif })
          .setTitle('📚 Slash Command & Sub Command Statistics')
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields(
            {
              name: `\\📂 Slash Commands\n[\`Commands: ${slashCommands.size - contextMenus.length} --- Categories: ${
                slashCategories.length
              }\`]`,
              value: `\`\`\`ansi\n\x1b[36m${slashCategories.join(' | ')}\x1b[0m\`\`\``,
            },
            {
              name: `\\📂 Sub Commands\n[\`Commands: ${subCommands.size} --- Categories: ${subCategories.length}\`]`,
              value: `\`\`\`ansi\n\x1b[36m${subCategories.join(' | ')}\x1b[0m\`\`\``,
            },
            {
              name: `\\📂 Context Menus [**${contextMenus.length}**]`,
              value: `\`\`\`ansi\n\x1b[36m${contextMenus.join(' | ')}\x1b[0m\`\`\``,
            },
            { name: '\u200b', value: 'Select Slash Command Category \\⤵️' }
          ),
      ],
      default: () => [
        new EmbedBuilder()
          .setColor(Colors.DarkGreen)
          .setThumbnail(cfg.slashPNG)
          .setAuthor({ name: guild.name, iconURL: cfg.book_gif })
          .setTitle(`\\📂 ${selectedCommand.toCapitalize()} Commands [${commands.length}]`)
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields(commands),
      ],
    };

    await interaction.editReply({ embeds: (showHelp[selectedCommand] || showHelp.default)(), components });
  },
};
