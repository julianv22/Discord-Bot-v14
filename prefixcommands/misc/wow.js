const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'wow',
  aliases: [],
  description: '😍 Wow!',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { author } = message;
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: author.displayName,
        iconURL: author.displayAvatarURL(true),
      })
      .setFooter({ text: '😍 Wow!' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    message.delete().then(() => message.channel.send({ embeds: [embed] }));
  },
};
