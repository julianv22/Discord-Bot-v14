const { Message, Client } = require('discord.js');
module.exports = {
  name: 'snipe',
  aliases: ['snp'],
  description: 'Snipe deleted messages.',
  category: 'misc',
  cooldown: 0,
  /**
   * Snipe deleted messages
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    const { cmdGuide, snipeMessage } = client;
    const { author, mentions, guild } = message;

    if (args.join(' ').trim() === '?')
      return cmdGuide(
        message,
        this.name,
        this.description,
        this.aliases,
        prefix + this.name + ` | ${prefix + this.name} <user>`,
      );

    const target = mentions.members.first() || guild.members.cache.get(args[0]);

    snipeMessage(author, target, null, message);
  },
};
