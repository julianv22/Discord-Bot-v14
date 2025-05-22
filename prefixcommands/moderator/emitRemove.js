const { Message, Client, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'emitRemove',
  aliases: ['rmv'],
  description: 'Emit Revmove Member\n' + cfg.adminRole + 'only',
  category: 'moderator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * Emit Revmove Member
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    const { member: user, mentions } = message;
    const member = mentions.members.first() || user;
    client.emit('guildMemberRemove', member);
  },
};
