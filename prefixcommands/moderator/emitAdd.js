const { Message, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'emitAdd',
  aliases: ['add'],
  description: 'Emit Add Member\n' + cfg.adminRole + 'only',
  category: 'moderator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { member: user, mentions } = message;
    const member = mentions.members.first() || user;
    client.emit('guildMemberAdd', member);
  },
};
