const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Snipe Message`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  /**
   * Snipe deleted message
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.targetUser, interaction);
  },
};
