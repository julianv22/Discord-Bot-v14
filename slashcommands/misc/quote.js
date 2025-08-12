const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 10,
  data: new SlashCommandBuilder().setName('quote').setDescription('Get a random quote from ZenQuotes.io'),
  /** Get a random quote from ZenQuotes
   * @param {Interaction} interaction Command Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply();

    const { guild, user } = interaction;
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();

    if (!response.ok || !data || !data[0] || !data[0].q || !data[0].a)
      throw new Error('Không thể lấy trích dẫn từ ZenQuotes.io');

    const quote = `❝ **${data[0].q}** ❞\n\n- ${data[0].a} -`;

    const embeds = [
      new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xffffff))
        .setThumbnail(cfg.Yusei_Avatar)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setDescription(quote)
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds });
  },
};
