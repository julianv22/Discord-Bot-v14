const { Client, Interaction, SlashCommandBuilder, Colors } = require('discord.js');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('ping').setDescription('Get bot latency.'),
  /** - Get bot latency
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { ws, errorEmbed } = client;
    // const sent = await interaction.deferReply({ withResponse: true });
    const ping = ws.ping;
    // const delay = sent.createdTimestamp - interaction.createdTimestamp;
    const delay = Math.abs(Date.now()) - interaction.createdTimestamp;
    const color = ping < 101 ? Colors.Green : ping > 300 ? Colors.DarkVividPink : Colors.Orange;

    return await interaction.reply(
      errorEmbed({ desc: `**Ping:** ${ping} / *${delay}ms*`, color: color, emoji: '⏱️', flags: false })
    );
  },
};
