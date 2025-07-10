const { Client, ChatInputCommandInteraction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /** - Button Interaction Event
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { catchError, compColection } = client;
    const { channel, customId } = interaction;

    if (channel.type === ChannelType.DM) return;

    try {
      const prefix = customId ? customId.split(':')[0] : '';

      let componentKey;
      if (interaction.isButton()) componentKey = 'buttons|';
      else if (interaction.isAnySelectMenu()) componentKey = 'menus|';
      else if (interaction.isModalSubmit()) componentKey = 'modals|';
      else return;
      componentKey += prefix;

      const component = compColection.get(componentKey);
      if (component) await component.execute(interaction, client);
    } catch (e) {
      return await catchError(interaction, e, `Error while executing ${chalk.green(customId)} component`);
    }
  },
};
