const {
  ContextMenuCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandType,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Snipe Message').setType(ApplicationCommandType.User),
  /** Snipe deleted message
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.snipeMessage(interaction.targetUser, interaction);
  },
};
