const { Message, Client } = require('discord.js');
const reactionRole = require('../../config/reactionRole');
module.exports = {
  name: 'messageDelete',
  /**
   * Delete message event
   * @param {Message} message - Message object
   * @param {Client} client - Client object
   */
  async execute(message, client) {
    try {
      const { guildId, channelId, author, content } = message;
      const config = await reactionRole
        .findOne({ guildID: guildId, channelId: channelId, messageId: message.id })
        .catch(console.error);
      if (config) {
        await reactionRole
          .findOneAndDelete({ guildID: guildId, channelId: channelId, messageId: message.id })
          .catch(console.error);
      }
      if (content) {
        const { snipes } = client;
        snipes.set(channelId, { author: author, content: content });
        snipes.set(guildId + '' + author.id, {
          channelId: channelId,
          author: author,
          content: content,
        });
      }
    } catch (e) {
      console.error(chalk.red('Error while executing messageDelete event'), e);
    }
  },
};
