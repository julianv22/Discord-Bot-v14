const { Client, Interaction, ChannelType } = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  /**
   * Menu interaction
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
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
