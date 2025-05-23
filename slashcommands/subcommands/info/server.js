const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('server'),
  category: 'sub command',
  parent: 'info',
  scooldown: 0,
  /**
   * Get server information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    client.serverInfo(guild, user, interaction);
  },
};
