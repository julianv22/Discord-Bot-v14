const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { rpsGame } = require('../../functions/common/games');
const { toCurrency } = require('../../functions/common/utilities');

module.exports = {
  type: 'buttons',
  data: { name: 'rps-btn' },
  /** - RPS Game
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, customId } = interaction;
    const { errorEmbed } = client;
    const [, button, betStr] = customId.split(':');
    const userMove = parseInt(button, 10);
    const bet = parseInt(betStr, 10);

    let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);
    // Kiểm tra tài khoản Economy
    if (!profile) return await interaction.update(errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!' }));
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
      return await interaction.update(errorEmbed({ desc: 'Bạn đã chơi hết 50 lần trong ngày!' }));
    // Kiểm tra tiền cược
    if (profile.balance < bet) {
      return await interaction.update(
        errorEmbed({
          desc: `Bạn không đủ tiền để cược! Số dư: ${toCurrency(profile.balance)}`,
          emoji: false,
        })
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
        return `Bạn thua và bị trừ **${toCurrency(bet)}**!`;
      },
      1: () => {
        return 'Hòa, bạn không bị trừ tiền!';
      },
      2: () => {
        profile.balance += winAmount;
        profile.totalEarned += winAmount;
        return `Bạn thắng và nhận được **${toCurrency(winAmount)}**!`;
      },
    };
    // Tăng số lần chơi và cập nhật
    profile.rpsCount += 1;
    profile.lastPlayRPS = today;
    await profile.save().catch(console.error);
    // Trả về kết quả
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Hi, ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTitle('You ' + rps.result)
      .setDescription(
        `${rps.description}\n\n${resString[rps.res]()}\nSố lần chơi hôm nay: **${
          profile.rpsCount
        }/50**\nSố dư: **${toCurrency(profile.balance)}**`
      )
      .setColor(rps.Color)
      .setThumbnail(user.displayAvatarURL(true))
      .setTimestamp()
      .addFields(
        {
          name: '\\💰 Tổng tiền đã nhận',
          value: toCurrency(profile.totalEarned) || 0,
          inline: true,
        },
        {
          name: '\\💸 Tổng tiền đã chi',
          value: toCurrency(profile.totalSpent) || 0,
          inline: true,
        }
      );

    return await interaction.update({ embeds: [embed] });
  },
};
