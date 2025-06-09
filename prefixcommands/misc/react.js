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

    try {
      let reactArray = [
        ['Cool!', '😎'],
        ['Greet', '👍'],
        ['Perfect', '🥳'],
        ['Wonderful', '😍'],
        ['Amazing', '😮'],
        ['Holy', '😱'],
      ];

      if (message.deletable) await message.delete();
      const reactId = Math.floor(Math.random() * reactArray.length);
      const reactMessage = await message.channel.send(reactArray[reactId][0]);
      await reactMessage.react(reactArray[reactId][1]);
    } catch (e) {
      console.error(chalk.red('Error while reacting message'), e);
    }
  },
};
