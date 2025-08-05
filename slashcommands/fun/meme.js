const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('meme').setDescription('Get a random meme from Reddit.'),
  /** - Get a random meme from Reddit.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply();

    const response = await fetch('https://meme-api.com/gimme');
    const data = await response.json();

    if (!data || !data.url)
      return await interaction.editReply(embedMessage({ desc: 'Could not fetch meme. Please try again later.' }));

    const embeds = [
      new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xffffff))
        .setAuthor({ name: 'Meme' + (data.author && ` by ${data.author}`), url: data.postLink })
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setFooter({
          text: `👍 Upvotes: ${data.ups.toLocaleString() ?? 0} | 🗨️ r/${data.subreddit || ''}`,
        }),
    ];

    await interaction.editReply({ embeds });
  },
};
