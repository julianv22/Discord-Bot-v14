const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Thanks').setType(ApplicationCommandType.User),
  /**
   * Thanks user
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    client.thanksUser(interaction.targetUser, interaction.user, interaction);
  },
};
