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
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ` | ${prefix + this.name} <user>`);

    const { author, mentions, guild } = message;
    const target = mentions.members.first() || guild.members.cache.get(args[0]);    

    client.snipeMessage(author, target, null, message);
  },
};
