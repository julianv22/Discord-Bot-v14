const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('wow').setDescription('😍 Wow!'),
  category: 'fun',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL(true) })
      .setFooter({ text: '😍 Wow!' })
      .setColor('Random')
      .setImage('https://thumbs.gfycat.com/FavoriteBasicBadger-max-1mb.gif');

    interaction.reply({ embeds: [embed] });
  },
};
