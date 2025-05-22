const { Message, Client } = require('discord.js');
module.exports = {
  name: 'botinfo',
  aliases: ['bot'],
  description: 'Bot Information',
  category: 'info',
  cooldown: 0,
  /**
   * Thông tin bot
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    client.botInfo(message.author, null, message);
  },
};
