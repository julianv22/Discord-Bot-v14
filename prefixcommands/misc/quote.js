const fetch = require('node-fetch');
const { EmbedBuilder, Message, Client } = require('discord.js');

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return '❝ **' + data[0]['q'] + '** ❞\n\n- ' + data[0]['a'] + ' -';
    });
}

module.exports = {
  name: 'quote',
  aliases: ['qt'],
  description: 'Trích dẫn 1 câu trên [zenquotes](https://zenquotes.io)',
  category: 'misc',
  cooldown: 10,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    getQuote()
      .then((quote) => {
        const { author, guild } = message;
        const embed = new EmbedBuilder()
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setColor('Random')
          .setDescription(quote)
          .setThumbnail(cfg.thumbnailURL)
          .setFooter({
            text: `Requested by ${author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp();
        message.channel.send({ embeds: [embed] });
      })
      .then(() => message.delete());
  },
};
