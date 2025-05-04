const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  Interaction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("wow").setDescription("😍 Wow!"),
  category: "fun",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL(true) })
      .setFooter({ text: "😍 Wow!" })
      .setColor("Random")
      .setImage(
        "https://media.discordapp.net/attachments/976364997066231828/1368430209845432320/images.png?ex=68183172&is=6816dff2&hm=03c2e073c401aaa2a67480de002707fc3b49d6aa57956e1e7326156c19e8536b&=&format=webp&quality=lossless"
      );

    interaction.reply({ embeds: [embed] });
  },
};
