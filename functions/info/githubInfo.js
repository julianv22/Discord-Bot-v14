const { Client, ChatInputCommandInteraction, Message } = require('discord.js');
const moment = require('moment-timezone');

/** @param {Client} client Client */
module.exports = (client) => {
  /** - Get Github information
   * @param {string} gitUserName Github username
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message */
  client.githubInfo = async (gitUserName, object) => {
    const { errorEmbed, catchError } = client;
    const author = object.user || object.author;

    try {
      fetch(`https://api.github.com/users/${gitUserName}`)
        .then((res) => res.json())
        .then(async (body) => {
          if (!body || body.message === 'Not Found')
            return await object
              .reply(errorEmbed({ desc: 'Can not find user ' + gitUserName, emoji: false }))
              .then((m) => {
                if (object.author)
                  setTimeout(async () => {
                    await m.delete().catch(console.error);
                  }, 10 * 1000);
              });

          let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } =
            body;

          return await object.reply({
            embeds: [
              {
                author: { name: 'Github Information!', iconURL: avatar_url },
                color: Math.floor(Math.random() * 0xffffff),
                fields: [
                  { name: 'Username', value: `${login}`, inline: true },
                  { name: 'ID', value: `${id}`, inline: true },
                  { name: 'Bio', value: `${bio}`, inline: true },
                  { name: 'Github', value: `[${name || login}](${html_url})`, inline: true },
                  { name: 'Public Repositories', value: `${public_repos || 'None'}`, inline: true },
                  { name: 'Followers', value: `${followers}`, inline: true },
                  { name: 'Following', value: `${following}`, inline: true },
                  { name: 'Location', value: `${location || 'No Location'}`, inline: true },
                  {
                    name: 'Account Created',
                    value: moment.utc(created_at).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY'),
                    inline: true,
                  },
                ],
                thumbnail: { url: avatar_url },
                timestamp: new Date(),
                footer: { text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) },
              },
            ],
          });
        });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('githubInfo')} function`);
    }
  };
};
