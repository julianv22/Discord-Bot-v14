const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription(`Ping pong!`),
  category: 'info',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const ping = client.ws.ping;
    const delay = sent.createdTimestamp - interaction.createdTimestamp;
    let color = ping < 101 ? 'Green' : ping > 300 ? 'Red' : 'Orange';

    const embed = new EmbedBuilder().setColor(color).setDescription(`**⏱ | Ping:** ${ping} / *${delay}ms*`);

    await interaction.editReply({ embeds: [embed] });
  },
};
