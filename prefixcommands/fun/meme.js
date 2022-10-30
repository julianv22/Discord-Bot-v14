const fetch = require('node-fetch');
const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'meme',
  aliases: [],
  description: 'Gửi một meme.',
  category: 'fun',
  cooldown: 30,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { guild, channel } = message;
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    //Start
    const Reds = ['memes', 'me_irl', 'dankmemes', 'comedyheaven', 'Animemes'];

    const Rads = Reds[Math.floor(Math.random() * Reds.length)];
    const res = await fetch(`https://www.reddit.com/r/${Rads}/random/.json`);
    const json = await res.json();

    if (!json[0])
      return channel.send({ embeds: [{ color: 16711680, description: `\\❌ | Đồn như lời!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 5000);
      });

    const data = json[0].data.children[0].data;
    const Embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setColor('Random')
      .setURL(`https://reddit.com${data.permalink}`)
      .setTitle(data.title)
      .setDescription(`Tác giả: **${data.author}**`)
      .setImage(data.url)
      .setFooter({ text: `${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬` });

    channel.send({ embeds: [Embed] }).then(() => message.delete());
    //End
  },
};
