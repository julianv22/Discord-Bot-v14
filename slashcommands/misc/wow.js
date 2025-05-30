const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('wow').setDescription('😍 Wow!'),
  /**
   * Wow!
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setFooter({ text: '😍 Wow!' })
      .setColor('Random')
      .setImage('https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png');

    return await interaction.reply({ embeds: [embed] });
  },
};
