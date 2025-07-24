const { Client, Message, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'emitAdd',
  aliases: ['add'],
  description: `Emit Add Member (${cfg.adminRole} only)`,
  category: 'administrator',
  cooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /** - Emit Add Member
   * @param {Message} message - Đối tượng message
   * @param {string[]} args - Mảng args
   * @param {Client} client - Đối tượng client */
  async execute(message, args, client) {
    const { mentions } = message;
    const { messageEmbed } = client;

    const memberToEmit = mentions.members.first();

    if (message.deletable) await message.delete().catch(console.error);

    if (!memberToEmit)
      return await message
        .reply(messageEmbed({ desc: 'Vui lòng mention một thành viên để kích hoạt sự kiện guildMemberAdd.' }))
        .then((m) => setTimeout(async () => m.delete().catch(console.error), 5 * 1000));

    client.emit('guildMemberAdd', memberToEmit);

    await timeoutMessage(`Đã kích hoạt sự kiện guildMemberAdd cho ${memberToEmit.user.tag}.`);
  },
};
