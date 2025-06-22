const { Message, Client } = require('discord.js');

module.exports = {
  name: 'wow',
  aliases: [],
  description: 'Wow! 😍',
  category: 'misc',
  cooldown: 0,
  /** - Wow! 😍
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { author } = message;
    if (args.join(' ').trim() === '?') return await client.commandUsage(message, this);

    if (message.deletable)
      await message.delete().then(
        async () =>
          await message.channel.send({
            embeds: [
              {
                author: { name: author.displayName || author.username, iconURL: author.displayAvatarURL(true) },
                color: Math.floor(Math.random() * 0xffffff),
                image: {
                  url: 'https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png',
                },
                footer: { text: 'Wow! 😍' },
              },
            ],
          }),
      );
  },
};
