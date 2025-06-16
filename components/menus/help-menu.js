const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../../functions/common/utilities');
const { readFiles } = require('../../functions/common/initLoader');

module.exports = {
  data: { name: 'help-menu' },
  /**
   * Help Menu
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { slashCommands, subCommands, helpSlash, helpPrefix, catchError } = client;
    const CommandType = interaction.values[0];

    try {
      const ignoreFolders = ['context menu', 'subcommands'];
      const slashFolders = readFiles('slashcommands', {
        isDir: true,
        filter: (folder) => !ignoreFolders.includes(folder),
      }).map((folder) => capitalize(folder));
      const subFolders = readFiles('slashcommands/subcommands', { isDir: true }).map((folder) => capitalize(folder));
      const contextMenus = Array.from(slashCommands.values())
        .filter((cmd) => cmd.category === ignoreFolders[0])
        .map((cmd) => cmd.data.name);

      const ShowHelp = {
        default: async () => await helpSlash(CommandType, interaction),
        prefix: async () => await helpPrefix(interaction),
        slash: async () => {
          await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
                .setTitle('Thống kê Slash Command & Sub Command')
                .addFields([
                  {
                    name: `\\📂 Slash Commands\n[\`Commands: ${
                      slashCommands.size - contextMenus.length
                    } --- Categories: ${slashFolders.length}\`]`,
                    value: `\`\`\`ansi\n\x1b[36m${slashFolders.join(' | ')}\x1b[0m\`\`\``,
                  },
                  {
                    name: `\\📂 Sub Commands\n[\`Commands: ${subCommands.size} --- Categories: ${subFolders.length}\`]`,
                    value: `\`\`\`ansi\n\x1b[36m${subFolders.join(' | ')}\x1b[0m\`\`\``,
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
