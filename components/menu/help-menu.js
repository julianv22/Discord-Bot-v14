const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../../functions/common/utilities');
const { readdirSync } = require('fs');

module.exports = {
  data: { name: 'help-menu' },
  /**
   * Help Menu
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { slashCommands, subCommands, helpSlash, helpPrefix, catchError } = client;
    const CommandType = interaction.values[0];

    try {
      const slashFolders = readdirSync('./slashcommands')
        .filter((folder) => folder !== 'context menu' && folder !== 'subcommands' && !folder.endsWith('.js'))
        .map((folder) => capitalize(folder));

      const subFolders = readdirSync('./slashcommands/subcommands')
        .filter((folder) => folder && !folder.endsWith('.js'))
        .map((folder) => capitalize(folder));

      const contextMenus = Array.from(slashCommands.values())
        .filter((cmd) => cmd.category === 'context menu')
        .map((cmd) => cmd.data.name);

      const ShowHelp = {
        default: async () => await helpSlash(CommandType, interaction),
        prefix: async () => await helpPrefix(interaction),
        slash: async () => {
          await interaction.update({
            embeds: [
              new EmbedBuilder()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
                .setTitle(`Thống kê Slash Command & Sub Command`)
                .addFields([
                  {
                    name: `Slash Commands\nCommands: [${slashCommands.size - contextMenus.length}] --- Categories: [${
                      slashFolders.length
                    }]`,
                    value: `\`\`\`ansi\n\u001b[36m${slashFolders.join(' | ')}\u001b[0m\`\`\``,
                  },
                  {
                    name: `Sub Commands\nCommands: [${subCommands.size}] --- Categories: [${subFolders.length}]`,
                    value: `\`\`\`ansi\n\u001b[36m${subFolders.join(' | ')}\u001b[0m\`\`\``,
                  },
                  {
                    name: `Context Menus [**${contextMenus.length}**]`,
                    value: `\`\`\`ansi\n\u001b[36m${contextMenus.join(' | ')}\u001b[0m\`\`\``,
                  },
                  { name: `\u200b`, value: `Select Slash Command Category \\⤵️` },
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
      (ShowHelp[CommandType] || ShowHelp.default)(CommandType);
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
