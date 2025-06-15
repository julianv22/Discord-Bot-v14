const { Message, Client } = require('discord.js');
const reactionRole = require('../../config/reactionRole');

module.exports = {
  name: 'messageDelete',
  /**
   * Delete message event
   * @param {Message} message - Message
   * @param {Client} client - Client
   */
  async execute(message, client) {
    try {
      const { guildId, channelId, id, author, content } = message;

      await reactionRole
        .findOneAndDelete({ guildID: guildId, channelId: channelId, messageId: id })
        .catch(console.error);

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
      console.error(chalk.red('Error while executing Snipe Message event\n'), e);
    }
  },
};
