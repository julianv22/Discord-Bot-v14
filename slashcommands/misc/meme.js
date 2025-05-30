const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('meme').setDescription('Get random meme from Reddit'),
  /**
   * Get random meme from Reddit
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user } = interaction;
    await interaction.deferReply();
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data || !data.url) {
        return await interaction.editReply(
          errorEmbed({ description: 'Could not fetch meme, please try again later!', emoji: false }),
        );
      }
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setURL(data.postLink)
        .setColor('Random')
        .setFooter({
          text: `👍 Upvotes: ${data.ups ?? 0} | 💬 Comments: ${data.num_comments ?? 0} | 🗨️ r/${data.subreddit || ''}`,
        });
      return await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error while fetching meme', e));
      await interaction.editReply(
        errorEmbed({ title: `\\❌ An error occurred while fetching meme`, description: e, color: 'Red' }),
      );
    }
  },
};
