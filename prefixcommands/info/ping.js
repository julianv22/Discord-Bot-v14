const { Client, Message, Colors } = require('discord.js');

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
    const { commandUsage, errorEmbed, ws } = client;
    if (args.join(' ').trim() === '?') return await commandUsage(message, this);

    const ping = ws.ping;
    const delay = Math.abs(Date.now() - message.createdTimestamp);
    const color = ping < 101 ? Colors.Green : ping > 300 ? Colors.DarkVividPink : Colors.Orange;

    await message.reply(errorEmbed({ desc: `**Ping:** ${ping} / *${delay}ms*`, color: color, emoji: '⏱️' }));
  },
};
