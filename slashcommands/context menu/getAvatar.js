const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get User Avatar').setType(ApplicationCommandType.User),
  /** - Retrieves and displays the avatar of a target user.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.getAvatar(interaction.targetUser, interaction);
  },
};
