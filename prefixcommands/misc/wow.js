const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'wow',
  aliases: [],
  description: 'Wow! 😍',
  category: 'misc',
  cooldown: 0,
  /** Wow! 😍
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { author } = message;
    if (args.join(' ').trim() === '?') return await client.commandUsage(message, this);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: author.displayName,
        iconURL: author.displayAvatarURL(true),
      })
      .setFooter({ text: 'Wow! 😍' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    if (message.deletable) await message.delete().then(async () => await message.channel.send({ embeds: [embed] }));
  },
};
