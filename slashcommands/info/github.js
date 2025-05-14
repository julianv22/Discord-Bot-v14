const fetch = require('node-fetch');
const moment = require('moment-timezone');
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription(`Github's Information`)
    .addStringOption((opt) => opt.setName('user').setDescription('Github Username').setRequired(true)),
  category: 'info',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const user = interaction.options.getString('user');
    const { user: author } = interaction;
    const { errorEmbed } = client;

    fetch(`https://api.github.com/users/${user}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.message) return interaction.reply(errorEmbed(true, 'Can not find this user!')).catch(() => {});
        let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } =
          body;

        // Fallback nếu thiếu dữ liệu
        login = login || 'Unknown';
        avatar_url = avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
        name = name || 'Unknown';
        id = id ? id.toString() : 'Unknown';
        html_url = html_url || 'https://github.com';
        public_repos = typeof public_repos === 'number' ? public_repos : 'None';
        followers = typeof followers === 'number' ? followers : '0';
        following = typeof following === 'number' ? following : '0';
        location = location || 'No Location';
        created_at = created_at || new Date().toISOString();
        bio = bio || 'No bio';

        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Github Information!', iconURL: avatar_url })
          .setColor('Random')
          .setThumbnail(avatar_url)
          .addFields([
            { name: 'Username', value: `${login}`, inline: true },
            { name: 'ID', value: `${id}`, inline: true },
            { name: 'Bio', value: `${bio}`, inline: true },
            {
              name: 'Github',
              value: `[${name || login}](${html_url})`,
              inline: true,
            },
            {
              name: 'Public Repositories',
              value: `${public_repos}`,
              inline: true,
            },
            { name: 'Followers', value: `${followers}`, inline: true },
            { name: 'Following', value: `${following}`, inline: true },
            {
              name: 'Location',
              value: `${location}`,
              inline: true,
            },
            {
              name: 'Account Created',
              value: moment.utc(created_at).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY'),
              inline: true,
            },
          ])
          .setFooter({
            text: `Requested by ${author.displayName}`,
            iconURL: author.displayAvatarURL(true),
          })
          .setTimestamp();

        interaction.reply({ embeds: [embed] }).catch(() => {});
      })
      .catch((e) => {
        interaction.reply(errorEmbed(true, 'Đã xảy ra lỗi khi lấy thông tin Github!')).catch(() => {});
        console.error('[slashcommands/info/github.js] Error fetching Github API:', e);
      });
  },
};
