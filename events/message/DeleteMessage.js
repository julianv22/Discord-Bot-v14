const { Message, Client } = require('discord.js');
const reactionRole = require('../../config/reactionRole');

module.exports = {
  name: 'messageDelete',
  /** - Delete message event
   * @param {Message} message - Message
   * @param {Client} client - Discord Client */
  async execute(message, client) {
    const { guildId, channelId, id, author, content } = message;
    const { messageSnipes, logError } = client;

    try {
      await reactionRole
        .findOneAndDelete({ guildID: guildId, channelId: channelId, messageId: id })
        .catch(console.error);

      if (content) {
        await messageSnipes.set(channelId, { author, content });
        await messageSnipes.set(guildId + author.id, { channelId, author, content });
      }
    } catch (e) {
      logError({ item: 'sniping delete message', desc: 'event' }, e);
    }
  },
};
