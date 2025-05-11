const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wikipedia')
    .setDescription('Search Wikipedia')
    .addStringOption((opt) => opt.setName('keyword').setDescription('Keyword').setRequired(true)),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    function capitalize(s) {
      try {
        return s && String(s[0]).toUpperCase() + String(s).slice(1);
      } catch (e) {
        console.log(e);
      }
    }

    const keyword = interaction.options.getString('keyword');
    const { user: author } = interaction;

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`)
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

        let {
          title,
          description,
          thumbnail,
          content_urls: {
            desktop: { page: page_url },
          },
          extract,
        } = body;
        const embed = new EmbedBuilder()
          .setColor('Random')
          .setAuthor({
            name: title,
            iconURL: 'https://vi.wikipedia.org/static/images/icons/wikipedia.png',
            url: page_url,
          })
          .setTitle(capitalize(description))
          .setURL(page_url)
          .setDescription(extract)
          .setFooter({
            text: `Requested by ${author.displayName}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setThumbnail(
            thumbnail?.source ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Wikipedia-logo-v2-vi.svg/250px-Wikipedia-logo-v2-vi.svg.png',
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      });
  },
};
