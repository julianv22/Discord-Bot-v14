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
    const { user, guild, guildId } = interaction;
    const { errorEmbed } = client;

    // Lấy top 10 user theo balance
    const topUsers = await economyProfile.find({ guildId }).sort({ balance: -1 }).limit(10).lean();

    if (!topUsers || !topUsers.length)
      return await interaction.reply(errorEmbed({ desc: 'No economy data found for this guild.' }));

    const emojis = ['1️⃣', '2️⃣', '3️⃣'];
    const leaderboard = topUsers
      .map((user, id) => {
        const rank = id < 3 ? emojis[id] : `**${id + 1}.**`;
        return `${rank} <@${user?.userId}> \\💰: ${user?.balance.toCurrency()} | \\🏦: ${user?.bank.toCurrency()}`;
      })
      .join('\n\n');

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(
          'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/09/Untitled-design-2023-07-31T120240.836-1.jpg'
        )
        .setAuthor({ name: '🏆 Economy Leaderboard', iconURL: guild.iconURL(true) })
        .setTitle(`Top \\🔟 richest users in ${guild.name}`)
        .setDescription(leaderboard)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    return await interaction.reply({ embeds });
  },
};
