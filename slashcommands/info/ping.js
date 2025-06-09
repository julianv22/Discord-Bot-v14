const { SlashCommandBuilder, Client, Interaction, Colors } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('ping').setDescription('Ping pong!'),
  /**
   * Get bot latency
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const sent = await interaction.deferReply({ withResponse: true });
    const ping = client.ws.ping;
    // const delay = sent.createdTimestamp - interaction.createdTimestamp;
    const delay = Math.abs(Date.now()) - interaction.createdTimestamp;
    let color = ping < 101 ? Colors.Green : ping > 300 ? Colors.Red : Colors.Orange;

    return await interaction.editReply(
      client.errorEmbed({ description: `**⏱ | Ping:** ${ping} / *${delay}ms*`, color: color }),
    );
  },
};
