const { SlashCommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe a deleted message')
    .addUserOption((opt) => opt.setName('user').setDescription('Provide user you wanna snipe')),
  /**
   * Snipe a deleted message
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.options.getUser('user'), interaction);
  },
};
