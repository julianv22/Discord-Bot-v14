const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('bot'),
  category: 'sub command',
  parent: 'info',
  scooldown: 0,
  /**
   * Get bot information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.botInfo(interaction.user, interaction);
  },
};
