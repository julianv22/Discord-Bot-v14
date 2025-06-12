const { ContextMenuCommandBuilder, Client, CommandInteraction, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Thanks').setType(ApplicationCommandType.User),
  /**
   * Thanks user
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.thanksUser(interaction.targetUser, interaction.user, interaction);
  },
};
