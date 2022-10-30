const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cry',
  aliases: [],
  description: '😭',
  category: 'fun',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    const { author: user, channel } = message;
    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('cry');
    const embed = new EmbedBuilder().setColor('Random').setDescription(`${user} is crying...`).setImage(data).setFooter({ text: '😭' });

    message.delete().then(() => {
      channel.send({ embeds: [embed] });
    });
  },
};
