const { Client, Interaction, InteractionType, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { modals, executeInteraction } = client;
    const { customId, type, channel } = interaction;

    if (channel.type === ChannelType.DM) return;

    if (type == InteractionType.ModalSubmit) {
      const modal = modals.get(customId);
      if (modal) executeInteraction(modal, interaction);
    }
  },
};
