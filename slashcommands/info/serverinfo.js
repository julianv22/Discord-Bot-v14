const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Get informations of bot/server/user'),
  /**
   * Show bot or server or user's info
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.serverInfo(interaction);
  },
};
