const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription(`Get server's information and set up server statistics (${cfg.adminRole} only)`)
    .addSubcommand((sub) => sub.setName('info').setDescription('Server info')),
  /** - Show bot or server information
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.serverInfo(interaction);
  },
};
