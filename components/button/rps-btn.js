const { Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'rps-btn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const [, button] = interaction.customId.split(':');
    client.rpsGame(parseInt(button, 10), interaction);
  },
};
