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
    const { commandUsage, errorEmbed, wikipedia } = client;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        prefix + this.name + ' keyword' + ' | ' + prefix + this.aliases + ' keyword'
      );

    const keyword = args.join(' ');
    if (!keyword)
      return await message.reply(errorEmbed({ desc: 'Vui lòng nhập từ khóa tìm kiếm!' })).then((m) => {
        setTimeout(async () => {
          await m.delete().catch(console.error);
        }, 10000);
      });

    await wikipedia(keyword, message);
  },
};
