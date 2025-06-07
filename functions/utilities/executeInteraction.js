const { Client, Interaction, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Execute interaction command
   * @param {String} type - Interaction type
   * @param {Interaction} interaction - Interaction object
   */
  client.executeInteraction = async (type, interaction) => {
    try {
      await type.execute(interaction, client);
    } catch (e) {
      client.catchError(interaction, e, `Error while executing interaction [${type.data.name}]`);
    }
  };
};
