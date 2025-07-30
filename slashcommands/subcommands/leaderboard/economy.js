const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('economy'),
  /** - Displays the economy leaderboard.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user } = interaction;
    const { embedMessage } = client;

    // Lấy top 10 user theo balance
    const topUsers = await economyProfile.find({ guildId }).sort({ balance: -1 }).limit(10).lean();

    if (!topUsers || !topUsers.length)
      return await interaction.reply(embedMessage({ desc: 'No economy data found for this guild.' }));

    await interaction.deferReply();

    const leaderboard = topUsers
      .map((user, id) => {
        const rank = id < 3 ? ['1️⃣', '2️⃣', '3️⃣'][id] : `**${id + 1}.**`;
        return `${rank} <@${user?.userId}> \\💰: ${user?.balance.toCurrency()} | \\🏦: ${user?.bank.toCurrency()}`;
      })
      .join('\n\n');

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.tournament_gif)
        .setAuthor({ name: guild.name + ' Economy Leaderboard', iconURL: cfg.onehundred_gif })
        .setTitle(`Top \\🔟 richest users in ${guild.name}`)
        .setDescription(leaderboard)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    return await interaction.editReply({ embeds });
  },
};
