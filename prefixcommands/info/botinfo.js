const { Message, Client } = require('discord.js');

module.exports = {
  name: 'botinfo',
  aliases: ['bot'],
  description: 'Bot Information',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    client.botInfo(message.author, null, message);
  },
};
