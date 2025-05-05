const { Message, Client } = require('discord.js');

module.exports = {
  name: 'snipe',
  aliases: ['snp'],
  description: 'Bắn tỉa tin nhắn đã bị xoá.',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
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
