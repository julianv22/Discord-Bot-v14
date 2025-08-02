const { Client, Message, EmbedBuilder } = require('discord.js');
const { commandUsage } = require('../../functions/common/logging');

module.exports = {
  name: 'wow',
  aliases: [],
  description: 'Wow! 😍',
  category: 'misc',
  cooldown: 0,
  /** - Wow! 😍
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { author } = message;
    if (args.join(' ').trim() === '?') return await commandUsage(message, this);

    if (message.deletable) {
      await message.delete();
      const embeds = [
        new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 0xffffff))
          .setAuthor({
            name: 'Wow!',
            iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif',
          })
          .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png')
          .setFooter({ text: author.displayName || author.username, iconURL: author.displayAvatarURL(true) })
          .setTimestamp(),
      ];

      await message.channel.send({ embeds });
    }
  },
};
