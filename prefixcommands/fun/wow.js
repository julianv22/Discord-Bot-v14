const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'wow',
  aliases: [],
  description: '😍 Wow!',
  category: 'fun',
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
      .setAuthor({ name: author.username, iconURL: author.displayAvatarURL(true) })
      .setFooter('😍 Wow!')
      .setColor('Random')
      .setImage('https://thumbs.gfycat.com/FavoriteBasicBadger-max-1mb.gif');

    message.delete().then(() => message.channel.send({ embeds: [embed] }));
  },
};
