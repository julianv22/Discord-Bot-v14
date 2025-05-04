const {
  ContextMenuCommandBuilder,
  Client,
  Interaction,
  ApplicationCommandType,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName(`Thanks`)
    .setType(ApplicationCommandType.User),
  category: "context menu",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    client.thanksUser(interaction.targetUser, interaction.user, interaction);
  },
};
