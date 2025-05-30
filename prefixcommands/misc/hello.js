const { Message, Client } = require('discord.js');
module.exports = {
  name: 'hello',
  aliases: ['hi'],
  description: `Hello! 👋`,
  category: 'misc',
  cooldown: 0,
  /**
   * Send a greeting
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    const { author } = message;
    const msg = await message.reply(`What is your name?`);

    await msg.channel
      .awaitMessages({
        filter: (m) => m.author.id === author.id,
        time: 5000,
        max: 1,
      })
      .then((m) => {
        // console.log(m.first().content);
        m.first()
          .delete()
          .then(() => msg.edit(`Hello ${m.first().content}!`));
      })
      .catch((e) => console.log(chalk.red('Collector time out'), e));
  },
};
