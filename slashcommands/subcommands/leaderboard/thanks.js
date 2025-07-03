const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const thanksProfile = require('../../../config/thanksProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  /** - Get thanks leaderboard
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const time = options.getString('time');

    let topUsers = await thanksProfile
      .find({ guildID: guild.id })
      .sort({ thanksCount: -1 })
      .limit(10)
      .catch(console.error);
    if (!topUsers || !topUsers.length)
      return await interaction.reply(errorEmbed({ desc: 'There is no thanks data in this server!' }));

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];
    const thanksList = topUsers
      .map((thanks, i) => {
        const rank = i < 3 ? emojis[i] : `**${i + 1}.**`;
        const { thanksCount: count, userID } = thanks;

        return rank + `<@${userID}> with ${count} thank${count > 1 ? 's' : ''}`;
      })
      .join('\n\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: '🏆 Thanks Leaderboard', iconURL: guild.iconURL(true) })
      .setTitle(`Top 10 Thanks${time ? ` ${time}` : ''}:`)
      .setDescription(thanksList)
      .setColor(Colors.DarkAqua)
      .setThumbnail(cfg.thanksPNG)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    return await interaction.reply({ embeds: [embed] });
  },
};
