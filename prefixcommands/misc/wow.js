const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'wow',
  aliases: [],
  description: 'Wow! 😍',
  category: 'misc',
  cooldown: 0,
  /**
   * Wow! 😍
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    const { author } = message;
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: author.displayName,
        iconURL: author.displayAvatarURL(true),
      })
      .setFooter({ text: 'Wow! 😍' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    if (message.deletable) message.delete().then(() => message.channel.send({ embeds: [embed] }));
  },
};
