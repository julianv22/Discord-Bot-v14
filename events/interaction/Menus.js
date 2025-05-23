const { Client, Interaction, ChannelType } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  /**
   * Menu Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { menus, executeInteraction } = client;
    const { customId, channel } = interaction;

    if (channel.type === ChannelType.DM) return;

    if (interaction.isStringSelectMenu()) {
      const prefix = customId.split(':')[0];
      const menu = menus.get(prefix);
      if (menu) executeInteraction(menu, interaction);
    }
  },
};
