const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Rob User').setType(ApplicationCommandType.User),
  /** - Rob money from a user
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await client.robUser(interaction.targetUser, interaction);
  },
};
