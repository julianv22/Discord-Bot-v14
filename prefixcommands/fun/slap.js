const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slap',
  aliases: [],
  description: '🤚',
  category: 'fun',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, this.aliases, cfg.prefix + this.name + ' <user>');

    const { author: user, mentions, channel } = message;
    const target = mentions.users.first();
    let desc;
    if (!target || target.id === user.id) desc = `Hmm ${user} is slapping themselves, what! \\👻`;
    else desc = `${user} slapped ${target}...`;

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('slap');
    const embed = new EmbedBuilder().setColor('Random').setDescription(desc).setImage(data).setFooter({ text: '🤚 Must have been a real baka!' });

    message.delete().then(() => {
      channel.send({ embeds: [embed] });
    });
  },
};
