const { EmbedBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('economy'),
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, guildId } = interaction;
    // Lấy top 10 user theo balance
    const topUsers = await economyProfile.find({ guildID: guildId }).sort({ balance: -1 }).limit(10).lean();

    if (!topUsers.length) {
      return interaction.reply(errorEmbed(true, 'No economy data found for this guild!'));
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];
    const leaderboard = topUsers
      .map((user, i) => {
        const rank = i < 3 ? emojis[i] : `**${i + 1}.**`;
        return `${rank} <@${user.userID}> \\💰 ${user.balance.toLocaleString()} | \\🔥 ${(
          user.streak || 0
        ).toLocaleString()} (max: ${(user.maxStreak || 0).toLocaleString()})`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: '🏆 Economy Leaderboard', iconURL: guild.iconURL(true) })
      .setTitle(`Top 10 richest users in ${interaction.guild.name}`)
      .setDescription(leaderboard)
      .setColor('Gold')
      .setThumbnail(cfg.economyPNG)
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
