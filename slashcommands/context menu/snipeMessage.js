const {
  ContextMenuCommandBuilder,
  Client,
  Interaction,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName(`Snipe Message`)
    .setType(ApplicationCommandType.User),
  category: "context menu",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.snipeMessage(interaction.user, interaction.targetUser, interaction);
  },
};
