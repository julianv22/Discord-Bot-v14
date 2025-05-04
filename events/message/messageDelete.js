const { Message, Client } = require("discord.js");

module.exports = {
  name: "messageDelete",

  /** @param {Message} message @param {Client} client */
  async execute(message, client) {
    try {
      const { guildId, channelId, author, content } = message;
      if (content) {
        const { snipes } = client;
        snipes.set(channelId, { author: author, content: content });
        snipes.set(guildId + "" + author.id, {
          channelId: channelId,
          author: author,
          content: content,
        });
      }
    } catch (e) {
      console.error(
        chalk.yellow.bold("Error while running messageDelete event"),
        e
      );
    }
  },
};
