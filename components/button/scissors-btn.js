const { Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'scissors-btn' },
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    client.rpsGame(3, interaction);
  },
};
