const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const achievementsConfig = require('../../config/economy/economyAchievements.json');
const { toCurrency } = require('../../functions/common/utilities');

module.exports = {
  category: 'economy',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('daily').setDescription('Claim your daily 💲 from the economy system!'),
  /** - Claim daily 💲 from the economy system
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, locale } = interaction;
    const { errorEmbed, catchError } = client;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
      if (!profile) {
        profile = await economyProfile
          .create({
            guildID: guild.id,
            guildName: guild.name,
            userID: user.id,
            usertag: user.tag,
            balance: 0,
            bank: 0,
            inventory: [],
            achievements: [],
            dailyCooldown: null,
            lastWork: null,
            lastRob: null,
            totalEarned: 0,
            totalSpent: 0,
            createdAt: new Date(),
          })
          .catch(console.error);
      }

      // Kiểm tra cooldown: chỉ cần qua 0h là nhận được
      const lastClaim = profile.dailyCooldown;
      if (lastClaim && lastClaim >= today) {
        // Tính thời gian còn lại đến 0h hôm sau
        const nextDaily = new Date();
        nextDaily.setHours(24, 0, 0, 0);
        const timeleft = Math.floor(nextDaily.getTime() / 1000);

        return await interaction.reply(
          errorEmbed({ desc: `Bạn vừa nhận \\💲 hôm nay! Hãy quay lại sau: <t:${timeleft}:R>`, emoji: false })
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

      const streak = profile.streak || 0;
      const maxStreak = profile.maxStreak || 0;
      const lastDaily = profile.lastDaily ? new Date(profile.lastDaily) : null;
      const bonusMsg = '';
      const resetStreak = false;
      const prevStreak = streak;

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
      const achvs = achievementsConfig.streak;
      const streakMilestones = Object.keys(achvs).map(Number);

      let achievementMsg = '';
      if (streakMilestones.includes(streak)) {
        const achv = achvs[streak];
        if (achv) {
          profile.balance += achv.reward;
          profile.totalEarned += achv.reward;
          bonusMsg = `\\🎉 **Chúc mừng!** Bạn đã đạt chuỗi **${streak.toLocaleString()} ngày** và nhận thêm **${toCurrency(
            achv.reward,
            locale
          )}**`;
          // Thêm achievement nếu chưa có
          if (!profile.achievements.includes(achv.name)) {
            profile.achievements.push(achv.name);
            achievementMsg = `\\🏆 **Bạn vừa nhận được thành tựu mới:** __${achv.name}__!`;
          }
        }
      }

      profile.streak = streak;
      profile.maxStreak = maxStreak;
      profile.lastDaily = today;

      await profile.save().catch(console.error);

      // Nếu bị reset streak và streak cũ > 7, gửi DM
      if (resetStreak)
        await user
          .send(
            `Bạn vừa bỏ lỡ chuỗi điểm danh liên tiếp **${prevStreak.toLocaleString()} ngày**! Chuỗi đã bị reset về 1. Hãy cố gắng duy trì streak lần sau nhé!\n\nFrom: ${
              guild.name
            }`
          )
          .catch(console.error);

      return await interaction.reply({
        embeds: [
          {
            author: { name: guild.name, iconURL: guild.iconURL(true) },
            title: 'Nhận \\💲 hằng ngày!',
            description: `Bạn đã nhận thành công **${toCurrency(
              dailyAmount,
              locale
            )}** ngày hôm nay!\nSố dư hiện tại: **${toCurrency(
              profile.balance,
              locale
            )}**.\n\n\\🔥 Chuỗi ngày nhận liên tiếp: **${streak.toLocaleString()}** (Kỷ lục: ${maxStreak.toLocaleString()})${bonusMsg}${achievementMsg}`,
            color: Math.floor(Math.random() * 0xffffff),
            thumbnail: { url: cfg.economyPNG },
            timestamp: new Date(),
            footer: { text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() },
          },
        ],
        flags: 64,
      });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
