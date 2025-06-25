const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'fun',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('meme').setDescription('Get random meme from Reddit'),
  /** - Get random meme from Reddit
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user } = interaction;
    const { errorEmbed } = client;

    await interaction.deferReply();

    const response = await fetch('https://meme-api.com/gimme');
    const data = await response.json();
    if (!data || !data.url) {
      return await interaction.editReply(errorEmbed({ desc: 'Could not fetch meme, please try again later!' }));
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTitle(data.title || 'Meme')
      .setColor('Random')
      .setImage(data.url)
      .setFooter({
        text: `👍 Upvotes: ${data.ups ?? 0} | 💬 Comments: ${data.num_comments ?? 0} | 🗨️ r/${data.subreddit || ''}`,
      });

    return await interaction.editReply({ embeds: [embed] });
  },
};
