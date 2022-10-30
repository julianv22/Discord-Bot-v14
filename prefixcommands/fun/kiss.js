const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'kiss',
  aliases: [],
  description: '👄',
  category: 'fun',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { mentions, author } = message;
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, null, prefix + this.name + ' <user>');

    const user = mentions.members.first();
    if (!user)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Bạn phải @ đến một ai đó!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    if (user.id === author.id)
      return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Đừng có tự sướng thế chứ 🤣` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('kiss');
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setDescription(`👄 **|** **${author}** *kissed*  **${user}**`)
      .setImage(data)
      .setFooter({ text: `👀` });

    message.delete().then(() => message.channel.send({ embeds: [embed] }));
  },
};
