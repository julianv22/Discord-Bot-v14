const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  Interaction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wikipedia")
    .setDescription("Search Wikipedia")
    .addStringOption((opt) =>
      opt.setName("keyword").setDescription("Keyword").setRequired(true)
    ),
  category: "info",
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const user = interaction.options.getString("keyword");
    const { user: author } = interaction;

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${user}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.status === 404)
          return interaction.reply({
            embeds: [
              {
                color: 16711680,
                description: `\\❌ | Can not find this content!`,
              },
            ],
            ephemeral: true,
          });

        let { title, thumbnail, content_urls, extract } = body;
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(title)
          .setThumbnail(thumbnail.source)
          .setURL(content_urls.desktop.page)
          .setDescription(extract)
          .setFooter({
            text: `Requested by ${author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
  },
};
