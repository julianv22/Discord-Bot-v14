const { Client, ChatInputCommandInteraction, Message, EmbedBuilder } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** - * @param {Client} client */
module.exports = (client) => {
  /** - Search Vietnamese Wikipedia articles by keyword
   * @param {string} keyword Search keyword
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message */
  client.wikipedia = async (keyword, object) => {
    const { errorEmbed, catchError } = client;
    const author = object.user || object.author;

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`)
      .then((res) => res.json())
      .then(async (body) => {
        if (body.status === 404)
          return await object
            .reply(errorEmbed({ desc: `Không tìm thấy thông tin nào với từ khóa \`${keyword}\`!`, emoji: false }))
            .then((m) => {
              if (object.author)
                setTimeout(async () => {
                  await m.delete().catch(console.error);
                }, 10 * 1000);
            });

        // Fallback nếu thiếu dữ liệu
        const bodyTitle = body.title || keyword;
        const title = body.description || 'Không có mô tả';
        const thumbnail =
            body.thumbnail?.source ||
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Wikipedia-logo-v2-vi.svg/250px-Wikipedia-logo-v2-vi.svg.png',
          description = body.extract || 'Không có nội dung.';
        const page_url =
          body.content_urls?.desktop?.page || `https://vi.wikipedia.org/wiki/${encodeURIComponent(keyword)}`;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: bodyTitle,
            iconURL: 'https://vi.wikipedia.org/static/images/icons/wikipedia.png',
            url: page_url,
          })
          .setTitle(title)
          .setDescription(description)
          .setColor('Random')
          .setThumbnail(thumbnail)
          .setTimestamp()
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          });

        return await object.reply({ embeds: [embed] });
      })
      .catch((e) => {
        return catchError(object, e, 'Error fetching Wikipedia API');
      });
  };
};
