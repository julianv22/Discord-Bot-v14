const { Message, Client } = require('discord.js');
module.exports = {
  name: 'botinfo',
  aliases: ['bot'],
  description: 'Bot Information',
  category: 'info',
  cooldown: 0,
  /**
   * Get bot information
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    client.botInfo(message.author, null, message);
  },
};
