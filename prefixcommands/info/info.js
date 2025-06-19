const { Client, Message } = require('discord.js');

module.exports = {
  name: 'info',
  aliases: [],
  description: 'Xem thông tin server/thành viên',
  category: 'info',
  cooldown: 0,
  /** Get server/member information
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { commandUsage, userInfo, serverInfo } = client;
    const { guild } = message;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        `Xem thông tin server: ${prefix + this.name}\n\nXem thông tin thành viên: ${prefix + this.name} @user`,
      );

    const member = message.mentions.members.first() || message.member || guild.members.cache.get(args[0]);

    if (member) await userInfo(member, message);
    else await serverInfo(message);
  },
};
