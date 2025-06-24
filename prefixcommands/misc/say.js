const { Message, Client } = require('discord.js');

module.exports = {
  name: 'say',
  aliases: [],
  description: 'Bot nói gì đó 🗣️',
  category: 'misc',
  cooldown: 0,
  /** - Send a message to the bot
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const toSay = args.join(' ');

    if (!toSay)
      return await message.reply(client.errorEmbed({ desc: 'Vui lòng nhập nội dung để bot nói!' })).then((m) => {
        setTimeout(async () => {
          await m.delete();
        }, 10000);
      });

    if (toSay.trim() === '?') return await client.commandUsage(message, this);

    if (message.deletable) await message.delete().then(async () => await message.channel.send(toSay));
  },
};
