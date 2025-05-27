const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { readdirSync } = require('fs');
module.exports = {
  data: { name: 'help-menu' },
  /**
   * Help Menu
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { slashCommands, subCommands, helpSlash, helpPrefix } = client;
    const { guild, user } = interaction;
    const CommandType = interaction.values[0];
    const slashFolders = readdirSync('./slashcommands').filter(
      (f) => f !== 'context menu' && f !== 'subcommands' && !f.endsWith('.js'),
    );
    const subFolders = readdirSync('./slashcommands/subcommands').filter((f) => f && !f.endsWith('.js'));
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
                  name: `Slash Commands [**${slashFolders.length}**]`,
                  value: `Folders:\`\`\`fix\n${slashFolders.join(' | ')}\`\`\``,
                },
                {
                  name: `Sub Commands [**${subFolders.length}**]`,
                  value: `Folders:\`\`\`fix\n${subFolders.join(' | ')}\`\`\``,
                },
                {
                  name: `Context Menus [**${contextMenus.length}**]`,
                  value: `\`\`\`fix\n${contextMenus.join(' | ')}\`\`\``,
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
  },
};
