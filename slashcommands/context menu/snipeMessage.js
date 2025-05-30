const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName(`Snipe Message`).setType(ApplicationCommandType.User),
  /**
   * Snipe deleted message
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.targetUser, interaction);
  },
};
