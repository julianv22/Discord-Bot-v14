const { Client, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('wikipedia')
    .setDescription('Search for Vietnamese Wikipedia articles by keyword')
    .addStringOption((opt) => opt.setName('keyword').setDescription('The keyword to search for').setRequired(true)),
  /** - Search Vietnamese Wikipedia articles by keyword
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.wikipedia(interaction.options.getString('keyword'), interaction);
  },
};
