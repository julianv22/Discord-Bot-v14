const { EmbedBuilder, Message } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [],
  description: "Ping pong!",
  category: "info",
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(" ").trim() === "?")
      return client.cmdGuide(message, this.name, this.description);

    const ping = client.ws.ping;
    const delay = Date.now() - message.createdTimestamp;
    let color = ping < 101 ? "Green" : ping > 300 ? "Red" : "Orange";

    const embed = new EmbedBuilder()
      .setColor(color)
      .setDescription(`**⏱ | Ping:** ${ping} / *${delay}ms*`);

    await message.reply({ embeds: [embed] });
  },
};
