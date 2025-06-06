const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName(`Get Info`).setType(ApplicationCommandType.User),
  /**
   * Get user information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, targetUser, user } = interaction;
    client.userInfo(guild, targetUser, user, interaction);
  },
};
