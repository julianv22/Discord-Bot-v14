const { Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'rps-btn' },
  /**
   * RPS Game Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const [, button, betStr] = interaction.customId.split(':');
    const bet = parseInt(betStr, 10);
    client.rpsGame(parseInt(button, 10), bet, interaction);
  },
};
