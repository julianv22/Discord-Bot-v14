const { Client, Message } = require('discord.js');
const { embedMessage, commandUsage } = require('../../functions/common/logging');

module.exports = {
  name: 'github',
  aliases: ['git'],
  description: 'Xem thông tin tài khoản Github.',
  category: 'info',
  cooldown: 0,
  /** - Get Github account information
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { githubInfo } = client;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        prefix + this.name + ' username' + ' | ' + prefix + this.aliases + ' username'
      );

    if (!args[0])
      return await message
        .reply(embedMessage({ desc: 'Hãy nhập username!' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10 * 1000));

    await githubInfo(args[0], message);
  },
};
