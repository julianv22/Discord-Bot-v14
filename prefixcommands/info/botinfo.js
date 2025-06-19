const { Message, Client } = require('discord.js');

module.exports = {
  name: 'botinfo',
  aliases: ['bot'],
  description: 'Xem thông tin bot',
  category: 'info',
  cooldown: 0,
  /** Get bot information
   * @param {Message} message Message
   * @param {Array} args Array of arguments
   * @param {Client} client Client */
  async execute(message, args, client) {
    const { commandUsage, botInfo } = client;
    if (args.join(' ').trim() === '?') return await commandUsage(message, this);

    await botInfo(message);
  },
};
