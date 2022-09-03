const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('cry').setDescription('😭'),
  category: 'fun',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user } = interaction;
    const random = require('something-random-on-discord').Random;
    let data = await random.getAnimeImgURL('cry');
    const embed = new EmbedBuilder().setColor('Random').setDescription(`${user} is crying...`).setImage(data).setFooter({ text: '😭' });
    interaction.reply({ embeds: [embed] });
  },
};
