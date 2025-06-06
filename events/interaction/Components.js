const { Client, Interaction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Button Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { executeInteraction, catchError, buttons, menus, modals } = client;
    const { channel, customId } = interaction;

    if (channel.type === ChannelType.DM) return;

    //Lấy customId
    let prefix = customId ? customId.split(':')[0] : null;
    //Method object của components
    const interactionTypes = {
      isButton: buttons,
      isStringSelectMenu: menus,
      isModalSubmit: modals,
    };
    //Handler component
    let component;

    try {
      //Duyệt qua các components
      for ([method, iType] of Object.entries(interactionTypes)) {
        //Kiểm tra method của component
        if (typeof interaction[method] === 'function' && interaction[method]()) component = iType.get(prefix);
      }
      //Thực thi component nếu có tồn tại
      if (component) await executeInteraction(component, interaction);
    } catch (e) {
      catchError(interaction, e, 'Unhandled for executing interaction');
    }
  },
};
