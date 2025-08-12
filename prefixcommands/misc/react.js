const { Client, Message } = require('discord.js');
const { commandUsage } = require('../../functions/common/logging');

module.exports = {
  name: 'react',
  aliases: [],
  description: 'Tạo một random react! 😎',
  category: 'misc',
  cooldown: 0,
  /** React with something cool! 😎
   * @param {Message} message Message
   * @param {string[]} args Array of arguments
   * @param {Client} client Discord Client */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return await commandUsage(message, this);

    try {
      const reactArray = [
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
