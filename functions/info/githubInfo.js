const { Client, Interaction, Message, EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');

/** @param {Client} client Client */
module.exports = (client) => {
  /** - Get Github information
   * @param {string} gitUserName - The GitHub username.
   * @param {Interaction|Message} object - The interaction or message object. */
  client.githubInfo = async (gitUserName, object) => {
    const { errorEmbed, catchError } = client;
    const author = object?.user || object?.author;

    try {
      const res = await fetch(`https://api.github.com/users/${gitUserName}`);
      const body = await res.json();

      if (body.message === 'Not Found') {
        const replyMessage = await object.reply(errorEmbed({ desc: 'Cannot find user ' + gitUserName }));

        if (object?.author)
          setTimeout(async () => {
            await replyMessage.delete().catch(console.error);
          }, 10 * 1000);

        return;
      }

      let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } =
        body;

      const embeds = [
        new EmbedBuilder()
          .setColor(Math.random() * 0xffffff)
          .setThumbnail(avatar_url)
          .setAuthor({ name: 'GitHub Information!', iconURL: cfg.warning_gif })
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp()
          .setFields(
            { name: 'Username', value: `${login}`, inline: true },
            { name: 'ID', value: `${id}`, inline: true },
            { name: 'Bio', value: `${bio || 'No Bio Provided'}`, inline: true },
            { name: 'GitHub', value: `[${name || login}](${html_url})`, inline: true },
            { name: 'Public Repositories', value: `${public_repos || 'None'}`, inline: true },
            { name: 'Followers', value: `${followers}`, inline: true },
            { name: 'Following', value: `${following}`, inline: true },
            { name: 'Location', value: `${location || 'No Location'}`, inline: true },
            {
              name: 'Account Created',
              value: moment.utc(created_at).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY'),
              inline: true,
            }
          ),
      ];

      return await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('githubInfo')} function`);
    }
  };
};
