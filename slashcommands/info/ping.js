const { Client, Interaction, SlashCommandBuilder, Colors } = require('discord.js');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('ping').setDescription('Get bot latency.'),
  /** - Get bot latency
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const sent = await interaction.deferReply();
    const ping = client.ws.ping;
    // const delay = sent.createdTimestamp - interaction.createdTimestamp;
    const delay = Math.abs(Date.now()) - interaction.createdTimestamp;
    const color = ping < 101 ? Colors.DarkGreen : ping > 300 ? Colors.DarkVividPink : Colors.Orange;

    await interaction.editReply(
      embedMessage({
        title: 'Bot latency:',
        desc: `**Ping:** ${ping} / *${delay}ms*`,
        color: color,
        emoji: 'https://fonts.gstatic.com/s/e/notoemoji/latest/23f0/512.gif', //'⏱️'
      })
    );
  },
};
