const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { rpsGame } = require('../../functions/common/games');

module.exports = {
  data: { name: 'rps-btn' },
  /**
   * RPS Game
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { user, guild, customId } = interaction;
    const { errorEmbed, catchError } = client;
    const [, button, betStr] = customId.split(':');
    const [bet, userMove] = [parseInt(betStr, 10), parseInt(button, 10)];

    try {
      let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
      // Kiểm tra tài khoản Economy
      if (!profile)
        return await interaction.update(errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!', emoji: false }));
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
        return await interaction.update(errorEmbed({ desc: 'Bạn đã chơi hết 50 lần trong ngày!', emoji: false }));
      // Kiểm tra tiền cược
      if (profile.balance < bet) {
        return await interaction.update(
          errorEmbed({
            description: `Bạn không đủ tiền để cược! Số dư: ${profile.balance.toLocaleString()}\\💲`,
            emoji: false,
          }),
        );
      }

      // Tính kết quả
      const rps = rpsGame(userMove, profile, bet);
      // Tính tiền thắng
      const winAmount = Math.floor(bet * (1 + Math.random() * 0.5)); // 1x ~ 1.5x
      // Tạo string cho kết quả
      const resString = {
        0: () => {
          profile.balance -= bet;
          profile.totalSpent -= bet;
          return `Bạn thua và bị trừ **${bet.toLocaleString()}\\💲**!`;
        },
        1: () => {
          return 'Hòa, bạn không bị trừ tiền!';
        },
        2: () => {
          profile.balance += winAmount;
          profile.totalEarned += winAmount;
          return `Bạn thắng và nhận được **${winAmount.toLocaleString()}\\💲**!`;
        },
      };
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
          `${rps.description}\n\n${resString[rps.res]()}\nSố lần chơi hôm nay: **${
            profile.rpsCount
          }/50**\nSố dư: **${profile.balance.toLocaleString()}\\💲**`,
        )
        .addFields([
          {
            name: '\\💰 Tổng tiền đã nhận',
            value: `${profile.totalEarned?.toLocaleString() || 0}\\💲`,
            inline: true,
          },
          {
            name: '\\💸 Tổng tiền đã chi',
            value: `${profile.totalSpent?.toLocaleString() || 0}\\💲`,
            inline: true,
          },
        ]);
      // Cập nhật tài khoản
      await profile.save().catch(console.error);
      // Trả về kết quả
      return await interaction.update({ embeds: [embed] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
