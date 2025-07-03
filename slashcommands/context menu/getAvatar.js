const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
  /** - Get user avatar
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.getAvatar(interaction.targetUser, interaction);
  },
};
