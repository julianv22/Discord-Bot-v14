const { Client, Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'emitRemove',
  aliases: ['rmv'],
  description: 'Emit Revmove Member\n' + cfg.adminRole + 'only',
  category: 'administrator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /** - Emit Revmove Member
   * @param {Message} message - Đối tượng message
   * @param {string[]} args - Mảng args
   * @param {Client} client - Đối tượng client */
  async execute(message, args, client) {
    const { member: user, mentions } = message;
    const member = mentions.members.first() || user;
    client.emit('guildMemberRemove', member);
  },
};
