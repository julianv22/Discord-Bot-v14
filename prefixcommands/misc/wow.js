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
      .setImage(
        'https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png?ex=68183172&is=6816dff2&hm=03c2e073c401aaa2a67480de002707fc3b49d6aa57956e1e7326156c19e8536b&=&format=webp&quality=lossless',
      );

    message.delete().then(() => message.channel.send({ embeds: [embed] }));
  },
};
