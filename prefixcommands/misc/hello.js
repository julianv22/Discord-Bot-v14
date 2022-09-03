const { Message, Client } = require('discord.js');

module.exports = {
  name: 'hello',
  aliases: ['hi'],
  description: `Hello! 👋`,
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    const { author } = message;
    const msg = await message.reply(`What's your name?`);

    await msg.channel
      .awaitMessages({
        filter: m => m.author.id === author.id,
        time: 5000,
        max: 1,
      })
      .then(m => {
        console.log(m.first().content);
        message.reply('Hello ' + m.first().content) + '!';
      })
      .catch(e => console.log('Collector time out'));
  },
};
