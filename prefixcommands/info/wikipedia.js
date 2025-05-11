const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'wikipedia',
  aliases: ['wiki'],
  description: 'Tra cứu thông tin trên Wikipedia.',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    function capitalize(s) {
      try {
        return s && String(s[0]).toUpperCase() + String(s).slice(1);
      } catch (e) {
        console.log(e);
      }
    }

    const { author } = message;
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <keyword>');

    const keyword = args.join(' ');
    if (!keyword)
      return message
        .reply({
          embeds: [
            {
              color: 16711680,
              description: `\\❌ | Bạn chưa nhập từ khóa!`,
            },
          ],
        })
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

    fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.status === 404)
          return message
            .reply({
              embeds: [
                {
                  color: 16711680,
                  description: `\\❌ | Không tìm thấy nội dung này!`,
                },
              ],
            })
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 10000);
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
            text: `Requested by ${author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setThumbnail(
            thumbnail?.source ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Wikipedia-logo-v2-vi.svg/250px-Wikipedia-logo-v2-vi.svg.png',
          );

        message.reply({ embeds: [embed] });
      });
  },
};
