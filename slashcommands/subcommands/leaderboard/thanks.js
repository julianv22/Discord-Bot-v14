const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const thanksProfile = require('../../../config/thanksProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  /** - Displays the thanks leaderboard.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;
    const time = options.getString('time');

    let topUsers = await thanksProfile.find({ guildID }).sort({ thanksCount: -1 }).limit(10).catch(console.error);
    if (!topUsers || !topUsers.length)
      return await interaction.reply(errorEmbed({ desc: 'No thanks data found for this server.' }));

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];
    const thanksList = topUsers
      .map((thanks, i) => {
        const rank = i < 3 ? emojis[i] : `**${i + 1}.**`;
        const { thanksCount: count, userID } = thanks;

        return rank + `<@${userID}> with ${count} thank${count > 1 ? 's' : ''}`;
      })
      .join('\n\n');

    const embeds = [
      new EmbedBuilder()
        .setAuthor({ name: '🏆 Thanks Leaderboard', iconURL: guild.iconURL(true) })
        .setTitle(`Top 10 Thanks${time ? ` ${time}` : ''}:`)
        .setDescription(thanksList)
        .setColor(Colors.DarkAqua)
        .setThumbnail(cfg.thanksPNG)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) }),
    ];

    return await interaction.reply({ embeds });
  },
};
