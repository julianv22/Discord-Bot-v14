const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
const moment = require('moment-timezone');
module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription(`Github's Information`)
    .addStringOption((opt) => opt.setName('username').setDescription('Github Username').setRequired(true)),
  /**
   * Show Github's information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const gitUsername = interaction.options.getString('username');
    const { user: author } = interaction;

    try {
      fetch(`https://api.github.com/users/${gitUsername}`)
        .then((res) => res.json())
        .then(async (body) => {
          if (!body || body.message === 'Not Found')
            return await interaction.reply(errorEmbed({ description: 'Can not find this user!', emoji: false }));

          let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } =
            body;

          const embed = new EmbedBuilder()
            .setAuthor({ name: 'Github Information!', iconURL: avatar_url })
            .setColor('Random')
            .setThumbnail(avatar_url)
            .addFields([
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
            ])
            .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
            .setTimestamp();

          return await interaction.reply({ embeds: [embed] });
        });
    } catch (e) {
      console.error(chalk.red('Error while running /github command:', e));
      return await interaction.reply(
        errorEmbed({ title: `Error while running \`/github\` command:`, description: e, color: 'Red' }),
      );
    }
  },
};
