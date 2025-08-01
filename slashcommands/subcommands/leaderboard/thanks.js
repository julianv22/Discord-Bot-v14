const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const thanksProfile = require('../../../config/thanksProfile');
const { embedMessage } = require('../../../functions/common/logging');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('thanks'),
  /** - Displays the thanks leaderboard.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guildId, user, options } = interaction;
    const description = options.getString('time');

    const topUsers = await thanksProfile.find({ guildId }).sort({ thanksCount: -1 }).limit(10).catch(console.error);
    if (!topUsers || !topUsers.length)
      return await interaction.reply(embedMessage({ desc: 'No thanks data found for this server.' }));

    await interaction.deferReply();

    const thanksList = topUsers
      .map((user, id) => {
        const rank = id < 3 ? ['1️⃣', '2️⃣', '3️⃣'][id] : `**${id + 1}.**`;
        const { thanksCount, userId } = user;

        return rank + ` <@${userId}> with ${thanksCount} thank${thanksCount > 1 ? 's' : ''}`;
      })
      .join('\n\n');

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkAqua)
        .setThumbnail(cfg.tournament_gif)
        .setAuthor({ name: guild.name + ' Thanks Leaderboard', iconURL: cfg.onehundred_gif })
        .setTitle(`Top 10 Thanks ${description || ''}:`)
        .setDescription(thanksList)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    return await interaction.editReply({ embeds });
  },
};
