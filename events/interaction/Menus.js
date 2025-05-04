const { Client, Interaction, ChannelType } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { menus, executeInteraction } = client;
    const { customId, channel } = interaction;

    if (channel.type === ChannelType.DM) return;

    if (interaction.isStringSelectMenu()) {
      const menu = menus.get(customId);
      if (menu) executeInteraction(menu, interaction);
    }
  },
};
