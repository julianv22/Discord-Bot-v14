const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder().setName('meme').setDescription('Lấy một meme ngẫu nhiên từ Reddit'),
  category: 'misc',
  scooldown: 0,
  /** @param {import('discord.js').Interaction} interaction */
  async execute(interaction) {
    function errorEmbed(content) {
      return { embeds: [{ color: 16711680, description: `\\❌ | ${content}` }], ephemeral: true };
    }

    const { user } = interaction;
    await interaction.deferReply();
    try {
      const response = await fetch('https://meme-api.com/gimme');
      const data = await response.json();
      if (!data || !data.url) {
        return interaction.editReply(errorEmbed('Could not fetch meme, please try again later!'));
      }
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) })
        .setTitle(data.title || 'Meme')
        .setImage(data.url)
        .setURL(data.postLink)
        .setColor('Random')
        .setFooter({
          text: `👍 Upvotes: ${data.ups ?? 0} | 💬 Comments: ${data.num_comments ?? 0} | 🗨️ r/${data.subreddit || ''}`,
        });
      await interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.error('Error fetching meme:', e);
      await interaction.editReply(errorEmbed(`An error occurred while fetching meme.\n${e}`));
    }
  },
};
