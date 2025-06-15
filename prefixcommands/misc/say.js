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
      return await message
        .reply(client.errorEmbed({ desc: 'Please enter the content you want the bot to say!', emoji: false }))
        .then((m) => {
          setTimeout(async () => {
            await m.delete();
          }, 10000);
        });

    if (message.deletable) await message.delete().then(async () => await message.channel.send(toSay));
  },
};
