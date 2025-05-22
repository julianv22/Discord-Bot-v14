const { Message, Client } = require('discord.js');
module.exports = {
  name: 'react',
  aliases: [],
  description: 'React with something cool! 😎',
  category: 'misc',
  cooldown: 0,
  /**
   * React với điều gì đó thú vị
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    let stReact = [
      ['Cool!', '😎'],
      ['Greet', '👍'],
      ['Perfect', '🥳'],
      ['Wonderful', '😍'],
      ['Amazing', '😮'],
      ['Holy', '😱'],
    ];

    message.delete();
    const raID = Math.floor(Math.random() * stReact.length);
    const msgReact = await message.channel.send(stReact[raID][0]);
    await msgReact.react(stReact[raID][1]);
  },
};
