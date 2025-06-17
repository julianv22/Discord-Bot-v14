const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandType,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User),
  /**
   * Get user avatar
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.getAvatar(interaction.targetUser, interaction);
  },
};
