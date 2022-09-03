const { Client, Interaction, InteractionType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { modals, executeInteraction } = client;
    const { customId, type } = interaction;

    if (type == InteractionType.ModalSubmit) {
      const modal = modals.get(customId);
      if (modal) executeInteraction(modal, interaction);
    }
  },
};
