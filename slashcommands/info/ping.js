const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription(`Ping pong!`),
  category: 'info',
  scooldown: 0,
  /**
   * Get bot latency
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const ping = client.ws.ping;
    const delay = sent.createdTimestamp - interaction.createdTimestamp;
    let color = ping < 101 ? 'Green' : ping > 300 ? 'Red' : 'Orange';
    return await interaction.editReply(
      client.errorEmbed({ description: `**⏱ | Ping:** ${ping} / *${delay}ms*`, color: color }),
    );
  },
};
