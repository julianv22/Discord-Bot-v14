const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../../functions/common/utilities');

module.exports = {
  type: 'menus',
  data: { name: 'help-menu' },
  /** - Help Menu
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { slashCommands, subCommands, helpSlash, helpPrefix, catchError } = client;
    const CommandType = interaction.values[0];

    try {
      const ignoreFolders = ['context menu', 'subcommands'];
      const slashCategory = [
        ...new Set(
          slashCommands.filter((cmd) => !ignoreFolders.includes(cmd.category)).map((cmd) => capitalize(cmd.category)),
        ),
      ];
      const subCategory = [...new Set(subCommands.map((cmd) => capitalize(cmd.parent)))];
      const contextMenus = slashCommands.filter((cmd) => cmd.category === ignoreFolders[0]).map((cmd) => cmd.data.name);

      const ShowHelp = {
        default: async () => {
          return await helpSlash(CommandType, interaction);
        },
        prefix: async () => {
          return await helpPrefix(interaction);
        },
        slash: async () => {
          return await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
                .setTitle('Thống kê Slash Command & Sub Command')
                .addFields([
                  {
                    name: `\\📂 Slash Commands\n[\`Commands: ${
                      slashCommands.size - contextMenus.length
                    } --- Categories: ${slashCategory.length}\`]`,
                    value: `\`\`\`ansi\n\x1b[36m${slashCategory.join(' | ')}\x1b[0m\`\`\``,
                  },
                  {
                    name: `\\📂 Sub Commands\n[\`Commands: ${subCommands.size} --- Categories: ${subCategory.length}\`]`,
                    value: `\`\`\`ansi\n\x1b[36m${subCategory.join(' | ')}\x1b[0m\`\`\``,
                  },
                  {
                    name: `\\📂 Context Menus [**${contextMenus.length}**]`,
                    value: `\`\`\`ansi\n\x1b[36m${contextMenus.join(' | ')}\x1b[0m\`\`\``,
                  },
                  { name: '\u200b', value: 'Select Slash Command Category \\⤵️' },
                ])
                .setThumbnail(cfg.slashPNG)
                .setColor('Random')
                .setTimestamp()
                .setFooter({
                  text: `Requested by ${user.displayName || user.username}`,
                  iconURL: user.displayAvatarURL(true),
                }),
            ],
          });
        },
      };

      (ShowHelp[CommandType] || ShowHelp.default)();
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
