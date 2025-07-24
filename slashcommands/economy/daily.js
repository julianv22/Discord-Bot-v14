const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const achievementsConfig = require('../../config/economy/economyAchievements.json');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily 💲 from the economy system.'),
  /** - Claim daily 💲 from the economy system
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guildId,
      guild: { name: guildName },
      user,
      user: { id: userId },
    } = interaction;
    const { errorEmbed } = client;
    const userName = user.displayName || user.username;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const profile = await economyProfile
      .findOneAndUpdate(
        { guildId, userId },
        { $setOnInsert: { guildName, userName, lastWork: '' } },
        { upsert: true, new: true }
      )
      .catch(console.error);

    if (!profile) {
      return await interaction.reply(
        errorEmbed({ desc: 'Đã xảy ra lỗi khi truy cập hoặc tạo hồ sơ kinh tế của bạn. Vui lòng thử lại sau.' })
      );
    }

    // Kiểm tra cooldown: chỉ cần qua 0h là nhận được
    const lastClaim = profile?.dailyCooldown;
    if (lastClaim && lastClaim >= today) {
      // Tính thời gian còn lại đến 0h hôm sau
      const nextDaily = new Date();
      nextDaily.setHours(24, 0, 0, 0);
      const timeleft = Math.floor(nextDaily.getTime() / 1000);

      return await interaction.reply(
        errorEmbed({ desc: `Bạn đã nhận \\💲 hôm nay! Hãy quay lại sau: <t:${timeleft}:R>`, emoji: '❌' })
      );
    }

    // Số \\💲 daily, random từ 500 tới 1000, ưu tiên gần 1000
    // Sử dụng phân phối bình phương để tăng xác suất số lớn
    const min = 500;
    const max = 1000;
    const rand = Math.random();
    const dailyAmount = Math.floor((max - min + 1) * Math.pow(rand, 0.5) + min); // sqrt bias

    profile.balance += dailyAmount;
    profile.totalEarned += dailyAmount;
    profile.dailyCooldown = new Date();

    // Xử lý streak
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    let streak = profile?.streak || 0;
    let maxStreak = profile?.maxStreak || 0;
    let lastDaily = profile?.lastDaily ? new Date(profile?.lastDaily) : null;
    let bonusMsg = '';
    let resetStreak = false;
    let prevStreak = streak;

    if (lastDaily && lastDaily.getTime() === yesterday.getTime()) {
      streak += 1;
    } else if (lastDaily && lastDaily.getTime() === today.getTime()) {
      // đã nhận hôm nay, không tăng streak
    } else {
      // Bỏ lỡ daily => reset streak
      if (streak > 1) resetStreak = true;
      streak = 1;
    }
    if (streak > maxStreak) maxStreak = streak;

    // Đọc achievements từ file JSON
    const streakMilestones = Object.keys(achievementsConfig).map(Number);

    let achievementMsg = '';
    if (streakMilestones.includes(streak)) {
      const achv = achievementsConfig[streak];
      if (achv) {
        profile.balance += achv.reward;
        profile.totalEarned += achv.reward;
        bonusMsg = `\\🎉 **Chúc mừng!** Bạn đã đạt chuỗi **${streak.toLocaleString()} ngày** và nhận thêm **${achv.reward.toCurrency()}**`;

        const { achievements } = profile || {};
        if (!achievements?.[streak]) achievements[streak] = { ...achievementsConfig[streak], claimAt: new Date() };
      }
    }

    // profile.streak = streak;
    profile.maxStreak = maxStreak;
    profile.lastDaily = today;
    profile.markModified('achievements');
    await profile.save().catch(console.error);
    // Nếu bị reset streak và streak cũ > 7, gửi DM
    if (resetStreak)
      await user
        .send(
          `Bạn vừa bỏ lỡ chuỗi điểm danh liên tiếp **${prevStreak.toLocaleString()} ngày**! Chuỗi đã bị reset về 1. Hãy cố gắng duy trì streak lần sau nhé!\n\nFrom: ${guildName}`
        )
        .catch(console.error);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setThumbnail(cfg.coin_gif)
        .setAuthor({ name: guildName, iconURL: cfg.money_wings_gif })
        .setTitle('Nhận \\💲 hằng ngày!')
        .setDescription(
          `Bạn đã nhận thành công **${dailyAmount.toCurrency()}** ngày hôm nay!\nSố dư hiện tại: **${profile?.balance.toCurrency()}**.\n\n\\🔥 Chuỗi ngày nhận liên tiếp: **${streak.toLocaleString()}** (Kỷ lục: ${maxStreak.toLocaleString()})${bonusMsg}${achievementMsg}`
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp(),
    ];

    return await interaction.reply({ embeds });
  },
};
