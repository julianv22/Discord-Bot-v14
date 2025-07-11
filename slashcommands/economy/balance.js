const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your balance, streak, bank, inventory, and achievements.'),
  /** - View balance, streak, bank, inventory, and achievements of a user
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;

    const profile = await economyProfile.findOne({ guildID, userID: user.id }).catch(console.error);
    if (!profile)
      return await interaction.reply(
        errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁' })
      );

    // Lấy thông tin
    const balance = (profile.balance || 0).toCurrency();
    const bank = (profile.bank || 0).toCurrency();
    const streak = (profile.streak || 0).toLocaleString();
    const maxStreak = (profile.maxStreak || 0).toLocaleString();
    const totalEarned = (profile.totalEarned || 0).toCurrency();
    const totalSpent = (profile.totalSpent || 0).toCurrency();
    const inventory = profile.inventory && profile.inventory.length ? profile.inventory.join(', ') : '\\🚫';
    const achievements = profile.achievements && profile.achievements.length ? profile.achievements.join(', ') : '\\🚫';
    const work = profile.lastWork || '\\❌ Chưa nhận (`/job` để nhận)';
    const lastJob = profile.lastJob || new Date();

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
      .setTitle('\\💳 Economy Information')
      .setColor(Colors.DarkGold)
      .setThumbnail(cfg.economyPNG)
      .setTimestamp()
      .setFooter({ text: guildName, iconURL: guild.iconURL(true) })
      .addFields(
        { name: '\\💰 Balance:', value: balance, inline: true },
        { name: '\\🏦 Bank:', value: bank, inline: true },
        { name: '\\🔥 Streak:', value: `${streak} / (max: ${maxStreak})`, inline: true },
        { name: '\\💲 Tổng thu:', value: totalEarned, inline: true },
        { name: '\\💲 Tổng chi:', value: totalSpent, inline: true },
        {
          name: '\u200b',
          value: '```Số 💲 kiếm được/chi tiêu không được tính trong việc giật 💲 (/rob)```',
          inline: false,
        },
        { name: '\\💼 Job:', value: `${work} -/- <t:${parseInt(lastJob / 1000)}:R>`, inline: false },
        { name: '\\📦 Inventory:', value: inventory, inline: false },
        { name: '\\🏆 Achievements:', value: achievements, inline: false }
      );

    return await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
