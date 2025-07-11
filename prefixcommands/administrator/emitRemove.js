const { Client, Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'emitRemove',
  aliases: ['rmv'],
  description: `Emit Remove Member (${cfg.adminRole} only)`,
  category: 'administrator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /** - Emit Revmove Member
   * @param {Message} message - Đối tượng message
   * @param {string[]} args - Mảng args
   * @param {Client} client - Đối tượng client */
  async execute(message, args, client) {
    const { mentions } = message;
    const { errorEmbed } = client;

    const memberToEmit = mentions.members.first();
    if (!memberToEmit)
      return await message.reply(
        errorEmbed({ desc: 'Vui lòng mention một thành viên để kích hoạt sự kiện `guildMemberRemove`.' })
      );

    client.emit('guildMemberRemove', memberToEmit);

    await message.reply(
      errorEmbed({ desc: `Đã kích hoạt sự kiện \`guildMemberRemove\` cho ${memberToEmit.user.tag}.`, emoji: true })
    );
  },
};
