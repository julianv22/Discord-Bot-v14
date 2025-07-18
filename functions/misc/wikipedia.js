const { Client, EmbedBuilder } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Searches Vietnamese Wikipedia articles by keyword.
   * @param {string} keyword - The keyword to search for.
   * @param {Interaction|Message} object - The interaction or message object. */
  client.wikipedia = async (keyword, object) => {
    const { errorEmbed, catchError } = client;
    const author = object?.user || object?.author;

    try {
      const res = await fetch(`https://vi.wikipedia.org/api/rest_v1/page/summary/${keyword}`);
      const body = await res.json();

      if (!res.ok || body.status === 404) {
        const replyMessage = await object.reply(
          errorEmbed({ desc: `No information found for keyword \`${keyword}\`!` })
        );

        if (object?.author)
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 10 * 1000);

        return;
      }

      // Fallback if data is missing
      const bodyTitle = body.title || keyword;
      const title = body.description || 'No description';
      const thumbnail =
        body.thumbnail?.source ||
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Wikipedia-logo-v2-vi.svg/250px-Wikipedia-logo-v2-vi.svg.png';
      const description = body.extract || 'No content.';
      const page_url =
        body.content_urls?.desktop?.page || `https://vi.wikipedia.org/wiki/${encodeURIComponent(keyword)}`;

      const embeds = [
        new EmbedBuilder()
          .setColor('Random')
          .setThumbnail(thumbnail)
          .setAuthor({
            name: bodyTitle,
            iconURL: 'https://vi.wikipedia.org/static/images/icons/wikipedia.png',
            url: page_url,
          })
          .setTitle(title)
          .setDescription(description)
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp(),
      ];

      return await object.reply({ embeds });
    } catch (e) {
      return catchError(object, e, `Error while executing ${chalk.green('wikipedia')} function`);
    }
  };
};
