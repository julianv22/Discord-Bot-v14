const { Client, Message } = require('discord.js');
const { embedMessage, commandUsage } = require('../../functions/common/logging');

module.exports = {
  name: 'wikipedia',
  aliases: ['wiki'],
  description: 'Tìm kiếm thông tin trên wikipedia',
  category: 'info',
  cooldown: 0,
  /** - Search Vietnamese Wikipedia articles by keyword
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { wikipedia } = client;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        prefix + this.name + ' keyword' + ' | ' + prefix + this.aliases + ' keyword'
      );

    const keyword = args.join(' ');
    if (!keyword)
      return await message
        .reply(embedMessage({ desc: 'Vui lòng nhập từ khóa tìm kiếm!' }))
        .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10 * 1000));

    await wikipedia(keyword, message);
  },
};
