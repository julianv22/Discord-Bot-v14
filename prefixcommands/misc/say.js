const { Client, Message } = require('discord.js');
const { embedMessage, commandUsage } = require('../../functions/common/logging');

module.exports = {
  name: 'say',
  aliases: [],
  description: 'Bot nói gì đó 🗣️',
  category: 'misc',
  cooldown: 0,
  /** - Send a message to the bot
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const content = args.join(' ');

    if (!content)
      return await message
        .reply(embedMessage({ desc: 'Vui lòng nhập nội dung để bot nói!' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10 * 1000));

    if (content.trim() === '?') return await commandUsage(message, this);

    if (message.deletable) {
      message.delete().catch(console.error);
      await message.channel.send(content);
    }
  },
};
