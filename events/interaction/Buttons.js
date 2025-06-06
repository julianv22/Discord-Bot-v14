const { Client, Interaction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Button Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { buttons, executeInteraction } = client;
    const { customId, channel } = interaction;

    if (channel.type === ChannelType.DM) return;

    if (!interaction.isButton()) return;
    const prefix = customId.split(':')[0];
    const button = buttons.get(prefix);
    if (button) executeInteraction(button, interaction);
  },
};
