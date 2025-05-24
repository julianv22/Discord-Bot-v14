const { Client, Interaction, EmbedBuilder } = require('discord.js');
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
                { name: `\u200b`, value: `Slash Command: **${slashCommands.size}**`, inline: true },
                { name: `\u200b`, value: `Sub Command: **${subCommands.size}**`, inline: true },
                { name: `\u200b`, value: `Select Slash Command Category \\⤵️`, inline: false },
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
