const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['avt'],
  description: 'Xem avatar của thành viên.',
  category: 'info',
  cooldown: 0,
  /** Get user avatar
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { getAvatar, commandUsage } = client;
    const { author, guild, mentions } = message;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        prefix + this.name + ' @username' + ' | ' + prefix + this.aliases + ' @username',
      );

    const target = mentions.users.first() || guild.members.cache.get(args[0]) || author;

    if (target) await getAvatar(target, message);
  },
};
