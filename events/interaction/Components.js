const { Client, ChatInputCommandInteraction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Button Interaction Event
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { catchError, envCollection } = client;
    const { channel, customId } = interaction;

    if (channel.type === ChannelType.DM) return;

    try {
      const prefix = customId ? customId.split(':')[0] : '';
      console.log('customId', customId ? prefix : undefined);

      let componentKey;
      if (interaction.isButton()) componentKey = 'buttons|';
      else if (interaction.isStringSelectMenu()) componentKey = 'menus|';
      else if (interaction.isModalSubmit()) componentKey = 'modals|';
      else return;
      componentKey += prefix;

      const component = envCollection.get(componentKey);
      if (component) await component.execute(interaction, client);
    } catch (e) {
      return await catchError(interaction, e, `Error while executing interaction component ${chalk.green(customId)}`);
    }
  },
};
