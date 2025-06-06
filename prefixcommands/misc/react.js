const { Message, Client } = require('discord.js');

module.exports = {
  name: 'react',
  aliases: [],
  description: 'React with something cool! 😎',
  category: 'misc',
  cooldown: 0,
  /**
   * React with something cool! 😎
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
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
