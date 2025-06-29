const { Client, Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'emitAdd',
  aliases: ['add'],
  description: 'Emit Add Member\n' + cfg.adminRole + 'only',
  category: 'administrator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /** - Emit Add Member
   * @param {Message} message - Đối tượng message
   * @param {string[]} args - Mảng args
   * @param {Client} client - Đối tượng client */
  async execute(message, args, client) {
    const { member: user, mentions } = message;
    const member = mentions.members.first() || user;
    client.emit('guildMemberAdd', member);
  },
};
