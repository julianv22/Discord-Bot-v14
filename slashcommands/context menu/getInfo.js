const {
  ContextMenuCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandType,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get Info').setType(ApplicationCommandType.User),
  /** Get user information
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.userInfo(interaction.targetUser, interaction);
  },
};
