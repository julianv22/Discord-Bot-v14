const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription("Get github user's informations")
    .addStringOption((opt) => opt.setName('username').setDescription('Github Username').setRequired(true)),
  /** - Show Github's information
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.githubInfo(interaction.options.getString('username'), interaction);
  },
};
