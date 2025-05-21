const { EmbedBuilder, Interaction, Client } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

/** @param {Client} client */
module.exports = (client) => {
  /** @param {Number} userMove @param {Interaction} interaction @param {Number} bet */
  client.rpsGame = async (userMove, bet, interaction) => {
    const { errorEmbed } = client;
    const { user, guild } = interaction;
    let botMove = Math.floor(Math.random() * 3);

    // Lấy profile user
    let profile = await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(() => {});
    if (!profile) {
      return interaction.update(errorEmbed(true, 'Bạn chưa có tài khoản Economy!'));
    }

    // Reset count nếu sang ngày mới
    const today = new Date();
    const lastPlay = profile.lastPlayRPS ? new Date(profile.lastPlayRPS) : null;
    const isNewDay = !lastPlay || today.toDateString() !== lastPlay.toDateString();
    if (isNewDay) {
      profile.rpsCount = 0;
      profile.lastPlayRPS = today;
    }

    // Kiểm tra số lần chơi/ngày
    if (profile.rpsCount >= 50) {
      return interaction.update({
        embeds: [
          {
            color: 16711680,
            description: `\\❌ | Bạn đã chơi hết 50 lần trong ngày!`,
          },
        ],
        components: [],
      });
    }

    // Kiểm tra đủ tiền cược
    if (profile.balance < bet) {
      return interaction.update(
        errorEmbed(true, `Bạn không đủ tiền để cược! Số dư: ${profile.balance.toLocaleString()}\\💲`),
      );
    }

    // Logic RPS
    let winAmount = Math.floor(bet * (1 + Math.random() * 0.5)); // 1x ~ 1.5x
    const RPS_CONFIG = {
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
    const {
      Emojis,
      Results: { Tie, Win, Lose },
      Compares,
      ResultStrings,
      Colors,
    } = RPS_CONFIG;
    const resultMatrix = [
      [Tie, Lose, Win],
      [Win, Tie, Lose],
      [Lose, Win, Tie],
    ];

    /**
     * Tính toán kết quả của trò chơi kéo búa bao
     * @param {Number} userMove - Nước đi của người dùng (0: Rock, 1: Paper, 2: Scissors)
     * @param {Number} botMove - Nước đi của bot (0: Rock, 1: Paper, 2: Scissors)
     * @returns {Object} Kết quả trò chơi với thông tin hiển thị
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
      const rps = rpsResult(userMove, botMove);

      // Tăng số lần chơi và cập nhật ngày
      profile.rpsCount += 1;
      profile.lastPlayRPS = today;

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
          `${rps.description}\n\n${RPS_CONFIG.Functions[rps.res]()}\nSố lần chơi hôm nay: **${
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

      await profile.save().catch(() => {});
      return interaction.update({ embeds: [embed] });
    } catch (e) {
      console.error('Error while running rpsGame', e);
      return interaction.update(errorEmbed(true, 'Đã xảy ra lỗi khi chơi game!'));
    }
  };
};
