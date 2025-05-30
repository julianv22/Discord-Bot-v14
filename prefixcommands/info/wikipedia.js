const { Message, Client, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../../functions/common/utilities');
module.exports = {
  name: 'wikipedia',
  aliases: ['wiki'],
  description: 'Search for information on Wikipedia.',
  category: 'info',
  cooldown: 0,
  /**
   * Search for information on Wikipedia
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    const { errorEmbed } = client;
    const { author } = message;
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <keyword>');

    const keyword = args.join(' ');
    if (!keyword)
      return message.reply(errorEmbed({ description: `Vui lòng nhập từ khóa tìm kiếm!`, emoji: false })).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.status === 404)
          return message
            .reply(
              errorEmbed({ description: `Không tìm thấy thông tin nào với từ khóa \`${keyword}\`!`, emoji: false }),
            )
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 10000);
            });

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
            text: `Requested by ${author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setThumbnail(thumbnail);

        message.reply({ embeds: [embed] });
      })
      .catch((e) => {
        message
          .reply(
            errorEmbed({ title: `\❌ | Error while running \`/wikipedia\` command:`, description: e, color: 'Red' }),
          )
          .catch(() => {});
        console.error(chalk.red('[wikipedia.js] Error fetching Wikipedia API:', e));
      });
  },
};
