const { Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'help-menu' },
  /**
   * Help Menu
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { helpPrefix, helpSlash } = client;
    const selected = interaction.values[0];
    const help = {
      default: () => helpSlash(selected, interaction),
      prefix: () => helpPrefix(interaction),
      slash: () => {
        return interaction.update({
          embeds: [
            {
              author: { name: `Select Slash Command Category ⤵️`, iconURL: cfg.slashPNG },
              color: Math.floor(Math.random() * 0xffffff),
            },
          ],
        });
      },
    };
    (help[selected] || help.default)(selected);
  },
};
