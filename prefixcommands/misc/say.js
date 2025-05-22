const { Message, Client } = require('discord.js');
module.exports = {
  name: 'say',
  aliases: [],
  description: 'Make the bot say something 🗣️',
  category: 'misc',
  cooldown: 0,
  /**
   * Gửi tin nhắn cho bot
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);
    const { errorEmbed } = client;
    let toSay = args.join(' ');

    if (!toSay)
      return message.reply(errorEmbed(true, 'Please enter the content you want the bot to say!')).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    message.delete().then(() => message.channel.send(toSay));
  },
};
