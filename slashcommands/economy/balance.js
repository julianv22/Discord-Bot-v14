const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your balance, streak, bank, inventory and achievements'),
  category: 'economy',
  scooldown: 0,
  /**
   * Xem số dư, độ dài chuỗi, số tiền gửi, hàng hóa và thành tích của người dùng
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild } = interaction;
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});
    if (!profile) {
      return interaction.reply(
        errorEmbed(true, `Bạn chưa có tài khoản Economy!\n ➡ Sử dụng \`/daily\` để khởi nghiệp 😁`),
      );
    }

    // Lấy thông tin
    const balance = (profile.balance || 0).toLocaleString();
    const bank = (profile.bank || 0).toLocaleString();
    const streak = (profile.streak || 0).toLocaleString();
    const maxStreak = (profile.maxStreak || 0).toLocaleString();
    const totalEarned = (profile.totalEarned || 0).toLocaleString();
    const totalSpent = (profile.totalSpent || 0).toLocaleString();
    const inventory = profile.inventory && profile.inventory.length ? profile.inventory.join(', ') : `\\🚫`;
    const achievements = profile.achievements && profile.achievements.length ? profile.achievements.join(', ') : `\\🚫`;
    const work = profile.lastWork || `\\❌ Chưa nhận (\`/job\` để nhận)`;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle(`\\💳 Economy Information`)
      .addFields(
        { name: `\\💰 Balance`, value: `${balance}\\💲`, inline: true },
        { name: `\\🏦 Bank`, value: `${bank}\\💲`, inline: true },
        { name: `\\🔥 Streak`, value: `${streak} / (max: ${maxStreak})`, inline: true },
        { name: `Tổng số \\💲 đã kiếm được`, value: `${totalEarned}\\💲`, inline: true },
        { name: `Tổng số \\💲 đã chi tiêu`, value: `${totalSpent}\\💲`, inline: true },
        {
          name: `\u200b`,
          value: `\`\`\`Số 💲 kiếm được/chi tiêu không được tính trong việc giật 💲 (/rob)\`\`\``,
          inline: false,
        },
        { name: `\\💼 Job`, value: work, inline: false },
        { name: `\\📦 Inventory`, value: inventory, inline: false },
        { name: `\\🏆 Achievements`, value: achievements, inline: false },
      )
      .setColor('Random')
      .setThumbnail(cfg.economyPNG)
      .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
