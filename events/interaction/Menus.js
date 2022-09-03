const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { menus, executeInteraction } = client;
    const { customId } = interaction;

    if (interaction.isSelectMenu()) {
      const menu = menus.get(customId);
      if (menu) executeInteraction(menu, interaction);
    }
  },
};
