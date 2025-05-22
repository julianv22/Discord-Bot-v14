const { Message, Client } = require('discord.js');
module.exports = {
  name: 'messageDelete',
  /**
   * Xóa message
   * @param {Message} message - Đối tượng message
   * @param {Client} client - Đối tượng client
   */
  async execute(message, client) {
    try {
      const { guildId, channelId, author, content } = message;
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
      console.error(chalk.red('Error while running messageDelete event'), e);
    }
  },
};
