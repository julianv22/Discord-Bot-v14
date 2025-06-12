const { EmbedBuilder, SlashCommandSubcommandBuilder, CommandInteraction, Client, Colors } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  category: 'sub command',
  parent: 'leaderboard',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('economy'),
  /**
   * Get economy leaderboard
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { user, guild, guildId } = interaction;
    const { errorEmbed, catchError } = client;

    try {
      // Lấy top 10 user theo balance
      let topUsers = await economyProfile.find({ guildID: guildId }).sort({ balance: -1 }).limit(10).lean();

      if (!topUsers.length) {
        return await interaction.reply(
          errorEmbed({ description: 'No economy data found for this guild!', emoji: false }),
        );
      }

      const emojis = ['1️⃣', '2️⃣', '3️⃣'];
      const leaderboard = topUsers
        .map((user, i) => {
          const rank = i < 3 ? emojis[i] : `**${i + 1}.**`;
          return `${rank} <@${
            user.userID
          }> \\💰: ${user.balance.toLocaleString()}\\💲 | \\🏦: ${user.bank.toLocaleString()}\\💲`;
        })
        .join('\n');

      const embed = new EmbedBuilder()
        .setAuthor({ name: '🏆 Economy Leaderboard', iconURL: guild.iconURL(true) })
        .setTitle(`Top \\🔟 richest users in ${interaction.guild.name}`)
        .setDescription(leaderboard)
        .setColor(Colors.Gold)
        .setThumbnail(
          'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/09/Untitled-design-2023-07-31T120240.836-1.jpg',
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
