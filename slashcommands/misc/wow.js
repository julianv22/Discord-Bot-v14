const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('wow').setDescription('😍 Wow!'),
  category: 'misc',
  scooldown: 0,
  /**
   * Wow!
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setFooter({ text: '😍 Wow!' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    await interaction.reply({ embeds: [embed] });
  },
};
