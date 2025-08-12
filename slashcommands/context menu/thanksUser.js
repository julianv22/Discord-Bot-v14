const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Thank User').setType(ApplicationCommandType.User),
  /** Thanks a target user.
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await client.thanksUser(interaction.targetUser, interaction);
  },
};
