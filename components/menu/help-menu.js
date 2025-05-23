const { Client, Interaction, EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'help-menu' },
  /**
   * Help Menu
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { slashCommands, subCommands, helpPrefix, helpSlash, user: bot } = client;
    const { guild } = interaction;
    const selected = interaction.values[0];
    const help = {
      default: () => helpSlash(selected, interaction),
      prefix: () => helpPrefix(interaction),
      slash: () => {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
              .setTitle(`Thống kê Slash Command & Sub Command`)
              .addFields([
                { name: `\u200b`, value: `Slash Command: **${slashCommands.size}**`, inline: true },
                { name: `\u200b`, value: `Sub Command: **${subCommands.size}**`, inline: true },
                { name: `\u200b`, value: `Select Slash Command Category \\⤵️`, inline: false },
              ])
              .setColor('Random')
              .setTimestamp(),
          ],
        });
      },
    };
    (help[selected] || help.default)(selected);
  },
};
