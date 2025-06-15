const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Snipe deleted messages')
    .addUserOption((opt) => opt.setName('target').setDescription('Provide user you wanna snipe')),
  /**
   * Snipe a deleted message
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.snipeMessage(interaction.options.getUser('target'), interaction);
  },
};
