const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription(`Get server's informations and setup server statistics (${cfg.adminRole} only)`)
    .addSubcommand((sub) => sub.setName('info').setDescription('Server info')),
  /** - Show bot or server information
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.serverInfo(interaction);
  },
};
