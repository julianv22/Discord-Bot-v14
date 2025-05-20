const { Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'rock-btn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.rpsGame(0, interaction);
  },
};
