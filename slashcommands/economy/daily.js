const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const achievementsConfig = require('../../config/economy/economyAchievements.json');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily 💲 from the economy system.'),
  /** - Claim daily 💲 from the economy system
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user } = interaction;
    const { name: guildName } = guild;
    const [userId, userName] = [user.id, user.displayName || user.username];
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
        embedMessage({ desc: 'Đã xảy ra lỗi khi truy cập hoặc tạo Economy profile của bạn. Vui lòng thử lại sau.' })
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
        embedMessage({ title: 'Bạn đã nhận 💲 hôm nay!', desc: `↪ Hãy quay lại sau: <t:${timeleft}:R>` })
      );
    }

    await interaction.deferReply();

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

    if (streakMilestones.includes(streak)) {
      const achv = achievementsConfig[streak];
      if (achv) {
        profile.balance += achv.reward;
        profile.totalEarned += achv.reward;
        bonusMsg = `\n- \\🎉 Chúc mừng! Bạn đã đạt chuỗi **${streak} ngày**.\n- Nhận danh hiệu **${
          achv.name
        }** và nhận thêm **${achv.reward.toCurrency()}**`;

        const { achievements } = profile || {};
        if (!achievements?.[streak]) achievements[streak] = { ...achv, claimAt: new Date() };
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
        .setAuthor({ name: guildName + ' Daily Economy', iconURL: cfg.money_wings_gif })
        .setDescription(
          `### ${user} đã nhận \\💲 hằng ngày!\n- Bạn đã nhận thành công **${dailyAmount.toCurrency()}** ngày hôm nay!\n- Số dư hiện tại: **${profile?.balance.toCurrency()}**.\n- \\🔥 Chuỗi ngày nhận liên tiếp: **${streak.toLocaleString()}** (Kỷ lục: ${maxStreak.toLocaleString()})${bonusMsg}`
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds });
  },
};
