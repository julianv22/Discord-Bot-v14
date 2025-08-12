const { Client, Message, PermissionFlagsBits } = require('discord.js');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  name: 'emitRemove',
  aliases: ['rmv'],
  description: `Emit Remove Member (${cfg.adminRole} only)`,
  category: 'administrator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /** Emit Revmove Member
   * @param {Message} message Đối tượng message
   * @param {string[]} args Mảng args
   * @param {Client} client Đối tượng client */
  async execute(message, args, client) {
    const { mentions } = message;

    const memberToEmit = mentions.members.first();

    if (message.deletable) await message.delete().catch(console.error);

    if (!memberToEmit)
      return await message
        .reply(embedMessage({ desc: 'Vui lòng mention một thành viên để kích hoạt sự kiện guildMemberRemove.' }))
        .then((m) => setTimeout(async () => m.delete().catch(console.error), 5 * 1000));

    client.emit('guildMemberRemove', memberToEmit);

    await timeoutMessage(`Đã kích hoạt sự kiện guildMemberRemove cho ${memberToEmit.user.tag}.`);
  },
};
