const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const achievementsConfig = require('../../config/economyAchievements.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily :coin: coins from the economy system!'),
  category: 'economy',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild } = interaction;
    const userID = user.id;
    const usertag = user.tag;
    const guildID = guild.id;
    const guildName = guild.name;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let profile = await economyProfile.findOne({ guildID, userID });
    if (!profile) {
      profile = await economyProfile.create({
        guildID,
        guildName,
        userID,
        usertag,
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
      });
    }

    // Kiểm tra cooldown: chỉ cần qua 0h là nhận được
    const lastClaim = profile.dailyCooldown;
    if (lastClaim && lastClaim >= today) {
      // Tính thời gian còn lại đến 0h hôm sau
      const nextDaily = new Date();
      nextDaily.setHours(24, 0, 0, 0);
      const timeleft = Math.floor(nextDaily.getTime() / 1000);
      return interaction.reply(
        errorEmbed(true, `Bạn vừa nhận :coin: coin hôm nay! Hãy quay lại sau: <t:${timeleft}:R>`),
      );
    }

    // Số :coin: coin daily, random từ 500 tới 1000, ưu tiên gần 1000
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
    let streak = profile.streak || 0;
    let maxStreak = profile.maxStreak || 0;
    let lastDaily = profile.lastDaily ? new Date(profile.lastDaily) : null;
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
    const achvs = achievementsConfig.streak;
    const streakMilestones = Object.keys(achvs).map(Number);

    let achievementMsg = '';
    if (streakMilestones.includes(streak)) {
      const achv = achvs[streak];
      if (achv) {
        profile.balance += achv.reward;
        profile.totalEarned += achv.reward;
        bonusMsg = `\\🎉 **Chúc mừng!** Bạn đã đạt chuỗi **${streak.toLocaleString()} ngày** và nhận thêm **${achv.reward.toLocaleString()}** \\💲!`;
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

    await profile.save();

    // Nếu bị reset streak và streak cũ > 7, gửi DM
    if (resetStreak) {
      try {
        await user.send(
          `Bạn vừa bỏ lỡ chuỗi điểm danh liên tiếp **${prevStreak.toLocaleString()} ngày**! Chuỗi đã bị reset về 1. Hãy cố gắng duy trì streak lần sau nhé!`,
        );
      } catch (e) {
        // Không gửi được DM (có thể user tắt DM)
      }
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Nhận :coin: coin hằng ngày!')
      .setDescription(
        `Bạn đã nhận thành công **${dailyAmount.toLocaleString()}** :coin: coin cho ngày hôm nay!\nSố dư hiện tại: **${profile.balance.toLocaleString()}** :coin: coin.\n\n\\🔥 Chuỗi ngày nhận liên tiếp: **${streak.toLocaleString()}** (Kỷ lục: ${maxStreak.toLocaleString()})${bonusMsg}${achievementMsg}`,
      )
      .setColor('Random')
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
