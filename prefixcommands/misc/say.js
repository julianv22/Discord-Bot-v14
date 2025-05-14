const { Message, Client } = require('discord.js');

module.exports = {
  name: 'say',
  aliases: [],
  description: '🗣️ Bot chat',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);
    const { errorEmbed } = client;
    let toSay = args.join(' ');

    if (!toSay)
      return message.reply(errorEmbed(true, 'Vui lòng nhập nội dung cần bot nói!')).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    message.delete().then(() => message.channel.send(toSay));
  },
};
