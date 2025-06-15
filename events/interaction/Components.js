const { Client, ChatInputCommandInteraction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Button Interaction Event
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { catchError, buttonCollection, menuCollection, modalCollection } = client;
    const { channel, customId } = interaction;

    if (channel.type === ChannelType.DM) return;
    //Method object của components
    const interactionTypes = {
      isButton: buttonCollection,
      isStringSelectMenu: menuCollection,
      isModalSubmit: modalCollection,
    };
    //Handler component
    let component;
    try {
      //Duyệt qua các components
      for ([method, iType] of Object.entries(interactionTypes)) {
        //Kiểm tra method của component
        if (typeof interaction[method] === 'function' && interaction[method]()) {
          //Lấy customId
          const prefix = customId ? customId.split(':')[0] : null;
          component = iType.get(prefix);
        }
      }
      //Thực thi component nếu có tồn tại
      if (component) await component.execute(interaction, client);
    } catch (e) {
      return await catchError(interaction, e, `Error while executing interaction component ${customId}`);
    }
  },
};
