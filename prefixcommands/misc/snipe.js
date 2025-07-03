const { Client, Message } = require('discord.js');

module.exports = {
  name: 'snipe',
  aliases: ['snp'],
  description: 'Snipe tin nhắn bị xoá',
  category: 'misc',
  cooldown: 0,
  /** - Snipe deleted messages
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { commandUsage, snipeMessage } = client;
    const { mentions, guild } = message;

    if (args.join(' ').trim() === '?')
      return await commandUsage(message, this, `${prefix + this.name} | ${prefix + this.name} @username`);

    const target = mentions.members.first() || guild.members.cache.get(args[0]);

    await snipeMessage(target, message);
  },
};
