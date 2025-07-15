const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Snipe Message').setType(ApplicationCommandType.User),
  /** - Retrieves and displays the last deleted message in the channel.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.snipeMessage(interaction.targetUser, interaction);
  },
};
