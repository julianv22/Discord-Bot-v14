const { Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'rps-btn' },
  /**
   * RPS
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const [, button, betStr] = interaction.customId.split(':');
    const bet = parseInt(betStr, 10);
    client.rpsGame(parseInt(button, 10), bet, interaction);
  },
};
