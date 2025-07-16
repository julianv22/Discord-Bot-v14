const { Client, Message, EmbedBuilder } = require('discord.js');

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
    if (args.join(' ').trim() === '?') return await client.commandUsage(message, this);

    if (message.deletable) {
      await message.delete();
      const embeds = [
        new EmbedBuilder()
          .setColor('Random')
          .setAuthor({ name: author.displayName || author.username, iconURL: author.displayAvatarURL(true) })
          .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png')
          .setFooter({ text: 'Wow! 😍' })
          .setTimestamp(),
      ];

      await message.channel.send({ embeds });
    }
  },
};
