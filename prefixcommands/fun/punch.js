const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'punch',
  aliases: [],
  description: '👊',
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

    const { author: user, guild, mentions, channel } = message;
    const target = mentions.members.first() || guild.members.cache.get(args[0]);

    if (!target)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Phải @ đến nạn nhân!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (target.id === user.id)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Ngu dốt! Không thể đấm chính mình 😅!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('punch');
    const embed = new EmbedBuilder().setColor('Random').setDescription(`${user} punched ${target}.`).setImage(data).setFooter({ text: '👊' });

    message.delete().then(() => {
      channel.send({ embeds: [embed] });
    });
  },
};
