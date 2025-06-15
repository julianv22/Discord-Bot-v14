const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription("Github's Information")
    .addStringOption((opt) => opt.setName('username').setDescription('Github Username').setRequired(true)),
  /**
   * Show Github's information
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const username = interaction.options.getString('username');

    await client.githubInfo(username, interaction);
  },
};
