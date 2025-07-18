const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('View your balance, streak, bank, inventory, and achievements.'),
  /** - View balance, streak, bank, inventory, and achievements of a user
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      user,
      user: { id: userId },
      guild,
      guildId,
      guild: { name: guildName },
    } = interaction;
    const { errorEmbed } = client;

    const profile = await economyProfile.findOne({ guildId, userId }).catch(console.error);
    if (!profile)
      return await interaction.reply(
        errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!\n ➡ Sử dụng `/daily` để khởi nghiệp 😁' })
      );

    // Lấy thông tin
    const balance = (profile?.balance || 0).toCurrency();
    const bank = (profile?.bank || 0).toCurrency();
    const streak = (profile?.streak || 0).toLocaleString();
    const maxStreak = (profile?.maxStreak || 0).toLocaleString();
    const totalEarned = (profile?.totalEarned || 0).toCurrency();
    const totalSpent = (profile?.totalSpent || 0).toCurrency();
    const inventory = profile?.inventory && profile?.inventory?.length ? profile?.inventory?.join(', ') : '\\🚫';
    const achievements =
      profile?.achievements && profile?.achievements?.length ? profile?.achievements?.join(', ') : '\\🚫';
    const work = profile?.lastWork || '\\❌ Chưa nhận (`/job` để nhận)';
    const lastJob = profile?.lastJob || new Date();

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.economyPNG)
        .setAuthor({ name: user.displayName || user.username, iconURL: user.displayAvatarURL(true) })
        .setTitle('\\💳 Economy Information')
        .setFooter({ text: guildName, iconURL: guild.iconURL(true) })
        .setTimestamp()
        .setFields(
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
        ),
    ];

    return await interaction.reply({ embeds, flags: 64 });
  },
};
