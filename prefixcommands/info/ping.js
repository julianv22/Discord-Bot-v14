const { Client, EmbedBuilder, Message, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = {
  name: 'ping',
  aliases: [],
  description: "Check the bot's latency!",
  category: 'info',
  cooldown: 0,
  /**
   * Check bot latency
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description);

    const ping = client.ws.ping;
    const delay = Math.abs(Date.now() - message.createdTimestamp); // Đảm bảo luôn dương
    let color = ping < 101 ? Colors.Green : ping > 300 ? Colors.Red : Colors.Orange;

    const embed = new EmbedBuilder().setColor(color).setDescription(`**⏱ | Ping:** ${ping} / *${delay}ms*`);

    return await message.reply({ embeds: [embed] }).catch(console.error);
  },
};
