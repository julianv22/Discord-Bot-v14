const { Client, Message } = require('discord.js');
const reactionRole = require('../../config/reactionRole');

module.exports = {
  name: 'messageDelete',
  /** - Delete message event
   * @param {Message} message - Message
   * @param {Client} client - Discord Client */
  async execute(message, client) {
    const { guildId, channelId, id: messageId, author, content } = message;
    const { messageSnipes, logError } = client;

    await reactionRole.findOneAndDelete({ guildId, channelId, messageId }).catch(console.error);

    try {
      const authorId = author?.id;
      if (content && authorId) {
        await messageSnipes.set(channelId, { authorId, content });
        await messageSnipes.set(guildId + authorId, { channelId, authorId, content });
      }
    } catch (e) {
      logError({ item: 'sniping delete message', desc: 'event' }, e);
    }
  },
};
