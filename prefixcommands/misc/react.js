const { Message, Client } = require('discord.js');

module.exports = {
  name: 'react',
  aliases: [],
  description: 'Cool! 😎',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    let stReact = [
      ['Cool!', '😎'],
      ['Greet!', '👍'],
      ['Perfect!', '🥳'],
      ['Wonderful!', '😍'],
      ['Amazing!', '😮'],
      ['Holy!', '😱'],
    ];

    message.delete();
    const raID = Math.floor(Math.random() * stReact.length);
    const msgReact = await message.channel.send(stReact[raID][0]);
    await msgReact.react(stReact[raID][1]);
  },
};
