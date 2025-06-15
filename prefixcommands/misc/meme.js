const { EmbedBuilder, Message, Client, Colors } = require('discord.js');

module.exports = {
  name: 'meme',
  aliases: [],
  description: 'Lấy một meme ngẫu nhiên từ Reddit',
  category: 'misc',
  cooldown: 0,
  /**
   * Get a random meme from Reddit
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);
    const { errorEmbed } = client;
    const { author } = message;
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data || !data.url) {
        return await message.reply(errorEmbed({ desc: 'Không lấy được meme, thử lại sau!', emoji: false }));
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
      console.error(chalk.red('Error while fetching memes\n'), e);
      await message.reply(errorEmbed({ title: '\\❌ Error while fetching memes', desc: e, color: Colors.Red }));
    }
  },
};
