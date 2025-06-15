const {
  ContextMenuCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandType,
} = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Thanks').setType(ApplicationCommandType.User),
  /**
   * Thanks user
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    await client.thanksUser(interaction.targetUser, interaction);
  },
};
