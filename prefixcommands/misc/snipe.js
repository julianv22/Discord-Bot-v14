const { Message, Client } = require('discord.js');
module.exports = {
  name: 'snipe',
  aliases: ['snp'],
  description: 'Snipe deleted messages.',
  category: 'misc',
  cooldown: 0,
  /**
   * Snipe deleted messages
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
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
