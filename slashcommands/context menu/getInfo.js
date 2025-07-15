const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get User Info').setType(ApplicationCommandType.User),
  /** - Retrieves and displays information about a target user.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.userInfo(interaction.targetUser, interaction);
  },
};
