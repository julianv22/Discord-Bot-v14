const { Message, Client } = require('discord.js');

module.exports = {
  name: 'thanks',
  aliases: ['ty'],
  description: 'Gửi lời cảm ơn tới một ai đó.',
  category: 'misc',
  cooldown: 30,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { cmdGuide, thanksUser } = client;
    const { guild, mentions, author } = message;

    if (args.join(' ').trim() === '?') return cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <user>');

    const user = mentions.members.first() || guild.members.cache.get(args[0]);

    thanksUser(user, author, null, message);
  },
};
