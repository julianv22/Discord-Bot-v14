const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('server'),
  category: 'sub command',
  parent: 'info',
  scooldown: 0,

  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user } = interaction;

    client.serverInfo(guild, user, interaction);
  },
};
