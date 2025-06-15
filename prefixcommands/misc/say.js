const { Message, Client } = require('discord.js');

module.exports = {
  name: 'say',
  aliases: [],
  description: 'Bot nói gì đó 🗣️',
  category: 'misc',
  cooldown: 0,
  /**
   * Send a message to the bot
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return await client.commandUsage(message, this);
    let toSay = args.join(' ');

    if (!toSay)
      return await message
        .reply(client.errorEmbed({ desc: 'Vui lòng nhập nội dung để bot nói!', emoji: false }))
        .then((m) => {
          setTimeout(async () => {
            await m.delete();
          }, 10000);
        });

    if (message.deletable) await message.delete().then(async () => await message.channel.send(toSay));
  },
};
