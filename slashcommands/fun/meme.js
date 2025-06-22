const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('meme').setDescription('Get random meme from Reddit'),
  /** - Get random meme from Reddit
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user } = interaction;
    const { errorEmbed, catchError } = client;

    await interaction.deferReply();
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data || !data.url) {
        return await interaction.editReply(
          errorEmbed({ desc: 'Could not fetch meme, please try again later!', emoji: false }),
        );
      }

      return await interaction.editReply({
        embeds: [
          {
            author: { name: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) },
            title: data.title || 'Meme',
            image: { url: data.url },
            color: Math.floor(Math.random() * 0xffffff),
            footer: {
              text: `👍 Upvotes: ${data.ups ?? 0} | 💬 Comments: ${data.num_comments ?? 0} | 🗨️ r/${
                data.subreddit || ''
              }`,
            },
          },
        ],
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
