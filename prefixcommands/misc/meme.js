const { EmbedBuilder, Message, Client } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  aliases: [],
  description: 'Lấy một meme ngẫu nhiên từ Reddit',
  category: 'misc',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);
    const { errorEmbed } = client;
    const { author } = message;
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data || !data.url) {
        return message.reply(errorEmbed(true, 'Không lấy được meme, thử lại sau!'));
      }
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Requested by ${author.displayName}`, iconURL: author.displayAvatarURL(true) })
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setURL(data.postLink)
        .setColor('Random')
        .setFooter({
          text: `👍 Upvotes: ${data.ups ?? 0} | 💬 Comments: ${data.num_comments ?? 0} | 🗨️ r/${data.subreddit || ''}`,
        });
      await message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Lỗi lấy meme:', e));
      await message.reply(errorEmbed(true, 'Đã xảy ra lỗi khi lấy meme.', e));
    }
  },
};
