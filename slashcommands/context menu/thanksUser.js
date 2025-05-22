const { ContextMenuCommandBuilder, Client, Interaction, ApplicationCommandType } = require('discord.js');
module.exports = {
  data: new ContextMenuCommandBuilder().setName(`Thanks`).setType(ApplicationCommandType.User),
  category: 'context menu',
  scooldown: 0,
  /**
   * Thanks user
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    client.thanksUser(interaction.targetUser, interaction.user, interaction);
  },
};
