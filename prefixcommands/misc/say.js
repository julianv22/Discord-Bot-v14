const { Message, Client } = require('discord.js');
module.exports = {
  name: 'say',
  aliases: [],
  description: 'Make the bot say something 🗣️',
  category: 'misc',
  cooldown: 0,
  /**
   * Send a message to the bot
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);
    let toSay = args.join(' ');

    if (!toSay)
      return message
        .reply(client.errorEmbed({ description: 'Please enter the content you want the bot to say!', emoji: false }))
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

    message.delete().then(() => message.channel.send(toSay));
  },
};
