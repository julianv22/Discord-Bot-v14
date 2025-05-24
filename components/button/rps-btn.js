const { Client, Interaction, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { rpsGame } = require('../../functions/common/games');
module.exports = {
  data: { name: 'rps-btn' },
  /**
   * RPS Game
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, customId } = interaction;
    const [, button, betStr] = customId.split(':');
    const bet = parseInt(betStr, 10);
    const userMove = parseInt(button, 10);
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});
    // Kiểm tra tài khoản Economy
    if (!profile) return await interaction.update(errorEmbed(true, 'Bạn chưa có tài khoản Economy!'));
    // Reset count nếu sang ngày mới
    const today = new Date();
    const lastPlay = profile.lastPlayRPS ? new Date(profile.lastPlayRPS) : null;
    const isNewDay = !lastPlay || today.toDateString() !== lastPlay.toDateString();
    if (isNewDay) {
      profile.rpsCount = 0;
      profile.lastPlayRPS = today;
    }
    // Kiểm tra số lần chơi trong ngày
    if (profile.rpsCount >= 50)
      return await interaction.update({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | Bạn đã chơi hết 50 lần trong ngày!`,
          },
        ],
        components: [],
      });
    // Kiểm tra tiền cược
    if (profile.balance < bet) {
      return await interaction.update(
        errorEmbed(true, `Bạn không đủ tiền để cược! Số dư: ${profile.balance.toLocaleString()}\\💲`),
      );
    }

    try {
      // Tính kết quả
      const rps = rpsGame(userMove, profile, bet);
      // Tăng số lần chơi và cập nhật ngày
      profile.rpsCount += 1;
      profile.lastPlayRPS = today;
      // Tạo embed thông báo kết quả
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Hi, ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setColor(rps.color)
        .setThumbnail(user.displayAvatarURL(true))
        .setTimestamp()
        .setTitle('You ' + rps.result)
        .setDescription(
          `${rps.description}\n\n${rpsConfig.Functions[rps.res]()}\nSố lần chơi hôm nay: **${
            profile.rpsCount
          }/50**\nSố dư: **${profile.balance.toLocaleString()}\\💲**`,
        )
        .addFields([
          {
            name: `\\💰 Tổng tiền đã nhận`,
            value: `${profile.totalEarned?.toLocaleString() || 0}\\💲`,
            inline: true,
          },
          {
            name: `\\💸 Tổng tiền đã chi`,
            value: `${profile.totalSpent?.toLocaleString() || 0}\\💲`,
            inline: true,
          },
        ]);
      // Cập nhật tài khoản
      await profile.save().catch(() => {});
      // Trả về kết quả
      return await interaction.update({ embeds: [embed] });
    } catch (e) {
      console.error('Error while running rpsGame', e);
      return await interaction.update(errorEmbed(true, 'Đã xảy ra lỗi khi chơi game!'));
    }
  },
};
