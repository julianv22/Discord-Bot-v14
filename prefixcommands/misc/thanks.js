const { Client, Message } = require('discord.js');

module.exports = {
  name: 'thanks',
  aliases: ['ty'],
  description: 'Gửi lời cảm ơn tới một ai đó.',
  category: 'misc',
  cooldown: 30,
  /** - Send a thank you message to someone
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { commandUsage, thanksUser } = client;
    const { guild, mentions } = message;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        prefix + this.name + ' @user' + ' | ' + prefix + this.aliases + ' @user'
      );

    const target = mentions.members.first() || guild.members.cache.get(args[0]);

    await thanksUser(target, message);
  },
};
