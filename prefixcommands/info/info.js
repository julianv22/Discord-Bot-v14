const { Client, Message } = require('discord.js');
module.exports = {
  name: 'info',
  aliases: ['serverinfo'],
  description: 'Xem thông tin server/thành viên',
  category: 'info',
  cooldown: 0,
  /**
   * Get server/member information
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(
        message,
        this.name,
        this.description,
        this.aliases,
        `Xem thông tin server: ${prefix + this.aliases}\n\nXem thông tin thành viên: ${prefix + this.name} <user>`,
      );

    const { guild, author } = message;
    const member = message.mentions.members.first() || message.member || guild.members.cache.get(args[0]);

    if (args.join(' ')) client.userInfo(guild, member, author, null, message);
    else client.serverInfo(guild, author, null, message);
  },
};
