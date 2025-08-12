const { Client, Interaction, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Rob User').setType(ApplicationCommandType.User),
  /** Attempts to rob money from a target user.
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await client.robUser(interaction.targetUser, interaction);
  },
};
