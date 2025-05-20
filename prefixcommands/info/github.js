const fetch = require('node-fetch');
const moment = require('moment-timezone');
const { EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'github',
  aliases: ['git'],
  description: 'Xem thông tin tài khoản Github.',
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { errorEmbed } = client;
    const { channel, guild, author } = message;
    if (args.join(' ').trim() === '?')
      return client.cmdGuide(message, this.name, this.description, this.aliases, prefix + this.name + ' <username>');

    if (!args[0])
      return channel.send(errorEmbed(true, 'Hãy nhập username!')).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    fetch(`https://api.github.com/users/${args[0]}`)
      .then((res) => res.json())
      .then((body) => {
        if (!body || body.message === 'Not Found')
          return channel.send(errorEmbed(true, 'User not found, please enter the correct username!')).then((m) => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });
        let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } =
          body;

        const embed = new EmbedBuilder()
          .setAuthor({ name: 'GitHub Information!', iconURL: guild.iconURL(true) })
          .setColor('Random')
          .setThumbnail(avatar_url)
          .addFields([
            { name: 'Username', value: `${login}`, inline: true },
            { name: 'ID', value: `${id}`, inline: true },
            { name: 'Bio', value: `${bio}`, inline: true },
            { name: 'Name', value: `[${name}](${html_url})`, inline: true },
            { name: 'Public Repositories', value: `${public_repos || 'None'}`, inline: true },
            { name: 'Followers', value: `${followers}`, inline: true },
            { name: 'Following', value: `${following}`, inline: true },
            { name: 'Location', value: `${location || 'No location'}`, inline: true },
            {
              name: 'Account Created',
              value: moment.utc(created_at).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY'),
              inline: true,
            },
          ])
          .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
          .setTimestamp();

        channel.send({ embeds: [embed] });
      });
  },
};
