const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { buttons, executeInteraction } = client;
    const { customId } = interaction;

    if (!interaction.isButton()) return;
    const button = buttons.get(customId);
    if (button) executeInteraction(button, interaction);
  },
};
