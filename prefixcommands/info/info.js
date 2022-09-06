const serverThanks = require('../../config/thanksProfile');
const moment = require('moment-timezone');
const { EmbedBuilder, ChannelType, Client, Message } = require('discord.js');

module.exports = {
  name: 'info',
  aliases: ['serverinfo'],
  description: 'Xem thông tin server/thành viên',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(
        message,
        this.name,
        this.description,
        this.aliases,
        `Xem thông tin server: ${prefix + this.aliases}\n\nXem thông tin thành viên: ${prefix + this.name} <user>`
      );

    const { guild, author } = message;
    const member = message.mentions.members.first() || message.member || guild.members.cache.get(args[0]);

    if (!member) client.severInfo(guild, author, null, message);
    else client.userInfo(guild, member, author, null, message);
  },
};
