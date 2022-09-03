const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pat',
  aliases: [],
  description: 'Xoa đầu ai đó',
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

    const { author: user, mentions, channel, guild } = message;
    const target = mentions.members.first() || guild.members.cache.get(args[0]);

    if (!target)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Phải @ đến ai đó!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('pat');
    const embed = new EmbedBuilder().setColor('Random').setDescription(`${user} is patting ${target}`).setImage(data).setFooter({ text: '🥰' });

    message.delete().then(() => {
      channel.send({ embeds: [embed] });
    });
  },
};
