const { Message, Client } = require('discord.js');

module.exports = {
  name: 'messageDelete',

  /** @param {Message} message @param {Client} client */
  async execute(message, client) {
    try {
      const { content, channel, author } = message;
      if (content) {
        const { snipes } = client;
        snipes.set(channel.id, { content: content, author: author });
        snipes.set(author.id, { content: content, author: author, channel: channel });
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running messageDelete event'), e);
    }
  },
};
