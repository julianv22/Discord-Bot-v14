const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { rpsGame } = require('../../functions/common/games');

module.exports = {
  type: 'buttons',
  data: { name: 'rps-game' },
  /** - RPS Game
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guildId, customId } = interaction;
    const { errorEmbed } = client;
    const [, buttonId, betInput] = customId.split(':');
    const userMove = { rock: 0, paper: 1, scissors: 2 };
    const bet = parseInt(betInput, 10);

    const profile = await economyProfile.findOne({ guildId, userId: user.id }).catch(console.error);
    // Kiểm tra tài khoản Economy
    if (!profile) return await interaction.update(errorEmbed({ desc: 'Bạn chưa có tài khoản Economy!' }));

    // Reset count nếu sang ngày mới
    const today = new Date();
    const lastPlay = profile?.lastPlayRPS ? new Date(profile?.lastPlayRPS) : null;
    const isNewDay = !lastPlay || today.toDateString() !== lastPlay.toDateString();

    if (isNewDay) {
      profile.rpsCount = 0;
      profile.lastPlayRPS = today;
    }

    // Kiểm tra số lần chơi trong ngày
    if (profile?.rpsCount >= 50) {
      await interaction.update({
        ...errorEmbed({ desc: `Bạn đã chơi hết ${profile?.rpsCount}/50 lần trong ngày.` }),
        components: [],
      });

      await interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.DarkVividPink)
            .setThumbnail(cfg.game_gif)
            .setAuthor({ name: `Hi, ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
            .setTitle(`Bạn đã chơi hết ${profile?.rpsCount}/50 lần trong ngày.`)
            .setDescription(`Số dư: **${profile?.balance.toCurrency()}**`)
            .setImage(cfg.rpsPNG)
            .setTimestamp()
            .setFields(
              { name: '\\💰 Tổng tiền đã nhận', value: (profile?.totalEarned || 0).toCurrency(), inline: true },
              { name: '\\💸 Tổng tiền đã chi', value: (profile?.totalSpent || 0).toCurrency(), inline: true }
            ),
        ],
      });

      return;
    }

    // Kiểm tra tiền cược
    if (profile?.balance < bet)
      return await interaction.update(
        errorEmbed({ desc: `Bạn không đủ tiền để cược! Số dư: ${profile?.balance.toCurrency()}` })
      );

    // Tính kết quả bằng function rpsGame
    const rps = rpsGame(userMove[buttonId]);
    let resultMessage = '';
    let winAmount = 0;

    switch (rps.res) {
      case 0: // Thua
        profile.balance -= bet;
        profile.totalSpent += bet;
        resultMessage = `Bạn thua và bị trừ **${bet.toCurrency()}**!`;
        break;
      case 1: // Hòa
        resultMessage = 'Hòa, bạn không bị trừ \\💲!';
        break;
      case 2: // Thắng
        winAmount = Math.floor(bet * (1 + Math.random() * 0.5)); // 1x ~ 1.5x
        profile.balance += winAmount;
        profile.totalEarned += winAmount;
        resultMessage = `Bạn thắng và nhận được **${winAmount.toCurrency()}**!`;
        break;
    }

    // Tăng số lần chơi và cập nhật
    profile.rpsCount += 1;
    profile.lastPlayRPS = today;
    await profile.save().catch(console.error);

    // Trả về kết quả
    return await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor(rps.color)
          .setThumbnail(cfg.game_gif)
          .setAuthor({ name: `Hi, ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
          .setTitle('You ' + rps.result)
          .setDescription(
            `${rps.description}\n\n${resultMessage}\nSố lần chơi hôm nay: **${
              profile?.rpsCount
            }/50**\nSố dư: **${profile?.balance.toCurrency()}**`
          )
          .setImage(cfg.rpsPNG)
          .setTimestamp()
          .setFields(
            { name: '\\💰 Tổng tiền đã nhận', value: (profile?.totalEarned || 0).toCurrency(), inline: true },
            { name: '\\💸 Tổng tiền đã chi', value: (profile?.totalSpent || 0).toCurrency(), inline: true }
          ),
      ],
    });
  },
};
