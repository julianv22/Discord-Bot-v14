const { Client, Message, Colors } = require('discord.js');
const { embedMessage, commandUsage } = require('../../functions/common/logging');

/** @param {Client} client - Discord Client */
module.exports = {
  name: 'ping',
  aliases: [],
  description: 'Kiểm tra độ trễ của bot',
  category: 'info',
  cooldown: 0,
  /** - Check bot latency
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return await commandUsage(message, this);

    const ping = client.ws.ping;
    const delay = Math.abs(Date.now() - message.createdTimestamp);
    const color = ping < 101 ? Colors.DarkGreen : ping > 300 ? Colors.DarkVividPink : Colors.Orange;

    await message.reply(
      embedMessage({
        title: 'Bot latency:',
        desc: `**Ping:** ${ping} / *${delay}ms*`,
        color: color,
        emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/23f0/512.gif',
      })
    );
  },
};
