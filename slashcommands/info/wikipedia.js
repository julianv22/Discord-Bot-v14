const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('wikipedia')
    .setDescription('Search Vietnamese Wikipedia articles by keyword')
    .addStringOption((opt) => opt.setName('keyword').setDescription('Keyword').setRequired(true)),
  category: 'info',
  scooldown: 0,
  /**
   * Search Vietnamese Wikipedia articles by keyword
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    /**
     * Capitalize a string
     * @param {String} str - String to capitalize
     * @returns {String} - Capitalized string
     */
    function capitalize(str) {
      if (!str) return ''; // Handle empty or undefined string
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const keyword = interaction.options.getString('keyword');
    const { user: author } = interaction;
    const { errorEmbed } = client;

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`)
      .then((res) => res.json())
      .then(async (body) => {
        if (body.status === 404)
          return await interaction.reply(errorEmbed(true, `Không tìm thấy thông tin nào với từ khóa \`${keyword}\`!`));

        // Fallback nếu thiếu dữ liệu
        let title = body.title || keyword;
        let description = body.description || 'Không có mô tả';
        let thumbnail =
          body.thumbnail?.source ||
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Wikipedia-logo-v2-vi.svg/250px-Wikipedia-logo-v2-vi.svg.png';
        let extract = body.extract || 'Không có nội dung.';
        let page_url =
          body.content_urls?.desktop?.page || `https://vi.wikipedia.org/wiki/${encodeURIComponent(keyword)}`;

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
      })
      .catch((e) => {
        message.reply(errorEmbed(true, 'Đã xảy ra lỗi khi lấy thông tin Wikipedia!')).catch(() => {});
        console.error(chalk.red('[wikipedia.js] Error fetching Wikipedia API:', e));
      });
  },
};
