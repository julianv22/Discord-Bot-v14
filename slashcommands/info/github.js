const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription("Get GitHub user's information")
    .addStringOption((opt) => opt.setName('username').setDescription('GitHub Username').setRequired(true)),
  /** - Show GitHub's information
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.githubInfo(interaction.options.getString('username'), interaction);
  },
};
