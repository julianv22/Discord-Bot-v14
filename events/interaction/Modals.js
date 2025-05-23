const { Client, Interaction, InteractionType, ChannelType } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  /**
   * Modal Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { modals, executeInteraction } = client;
    const { customId, type, channel } = interaction;

    if (channel.type === ChannelType.DM) return;

    if (type == InteractionType.ModalSubmit) {
      const prefix = customId.split(':')[0];
      const modal = modals.get(prefix);
      if (modal) executeInteraction(modal, interaction);
    }
  },
};
