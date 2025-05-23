const economyProfile = require('../../config/economyProfile');
const { Client, Interaction, EmbedBuilder } = require('discord.js');
module.exports = {
  data: { name: 'rps-btn' },
  /**
   * RPS Game
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild } = interaction;
    const [, button, betStr] = interaction.customId.split(':');
    const bet = parseInt(betStr, 10);
    const botMove = Math.floor(Math.random() * 3);
    const userMove = parseInt(button, 10);
    const profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});
    // Kiểm tra tài khoản Economy
    if (!profile) return interaction.update(errorEmbed(true, 'Bạn chưa có tài khoản Economy!'));
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
      return interaction.update({
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
      return interaction.update(
        errorEmbed(true, `Bạn không đủ tiền để cược! Số dư: ${profile.balance.toLocaleString()}\\💲`),
      );
    }
    /**
     * RPS Config
     * @property {Object} Emojis - Emojis cho các nước đi
     * @property {Object} Results - Kết quả RPS dạng số
     * @property {Object} Compares - String so sánh kết quả RPS
     * @property {Object} ResultStrings - String kết quả RPS
     * @property {Object} Colors - Màu sắc cho embed
     * @property {Object} Functions - Hàm xử lý kết quả RPS trả về string
     */
    const rpsConfig = {
      Emojis: { 0: '🔨', 1: '📄', 2: '✂️' },
      Results: { Lose: 0, Tie: 1, Win: 2 },
      Compares: { 0: '<', 1: '=', 2: '>' },
      ResultStrings: { 0: `Lose \\🏳️`, 1: `Tie \\🤝`, 2: `Win \\🎉` },
      Colors: { 0: 'Red', 1: 'Orange', 2: 'Green' },
      Functions: {
        0: () => {
          profile.balance -= bet;
          profile.totalSpent -= bet;
          return `Bạn thua và bị trừ **${bet.toLocaleString()}\\💲**!`;
        },
        1: () => {
          return `Hòa, bạn không bị trừ tiền!`;
        },
        2: () => {
          profile.balance += winAmount;
          profile.totalEarned += winAmount;
          return `Bạn thắng và nhận được **${winAmount.toLocaleString()}\\💲**!`;
        },
      },
    };
    // Destructure RPS Config
    const {
      Emojis,
      Results: { Tie, Win, Lose },
      Compares,
      ResultStrings,
      Colors,
    } = rpsConfig;
    // Số tiền thắng
    let winAmount = Math.floor(bet * (1 + Math.random() * 0.5)); // 1x ~ 1.5x
    // Ma trận kết quả
    const resultMatrix = [
      [Tie, Lose, Win],
      [Win, Tie, Lose],
      [Lose, Win, Tie],
    ];
    /**
     * Hàm tính kết quả RPS
     * @param {Number} userMove - Nước đi của người dùng
     * @param {Number} botMove - Nước đi của bot
     * @returns {Object} - Trả về object gồm:
     * - result: Kết quả RPS
     * - color: Màu sắc cho embed
     * - description: Mô tả cho embed
     * - res: Kết quả RPS dạng số
     */
    function rpsResult(userMove, botMove) {
      const res = resultMatrix[userMove][botMove];
      return {
        result: ResultStrings[res],
        color: Colors[res],
        description: `〔You ${Emojis[userMove]}〕 ${Compares[res]} 〔Bot ${Emojis[botMove]}〕`,
        res,
      };
    }
    try {
      // Tính kết quả
      const rps = rpsResult(userMove, botMove);
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
      return interaction.update({ embeds: [embed] });
    } catch (e) {
      console.error('Error while running rpsGame', e);
      return interaction.update(errorEmbed(true, 'Đã xảy ra lỗi khi chơi game!'));
    }
  },
};
