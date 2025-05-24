/**
 * RPS Game
 * @param {number} userMove - Nước đi của người dùng
 * @param {mongoose.Document<economyProfile>} profile - Profile của người dùng
 * @param {number} bet - Số tiền cá cược
 * @returns {Object} - Trả về object gồm:
 * - result: Kết quả RPS
 * - color: Màu sắc cho embed
 * - description: Mô tả cho embed
 * - res: Kết quả RPS dạng số
 */
function rpsGame(userMove, profile, bet) {
  const botMove = Math.floor(Math.random() * 3);
  const winAmount = Math.floor(bet * (1 + Math.random() * 0.5)); // 1x ~ 1.5x
  /**
   * RPS Config
   * @type {Object}
   * @property {Object} Emojis - Các emoji cho từng nước đi
   * @property {Object} Results - Kết quả RPS dạng số
   * @property {Object} Compares - So sánh giữa người dùng và bot
   * @property {Object} ResultStrings - Kết quả RPS dạng string
   * @property {Object} Colors - Màu sắc cho từng kết quả
   * @property {Object} Functions - Hàm xử lý kết quả RPS
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

  const {
    Emojis,
    Results: { Tie, Win, Lose },
    Compares,
    ResultStrings,
    Colors,
  } = rpsConfig;

  const resultMatrix = [
    [Tie, Lose, Win],
    [Win, Tie, Lose],
    [Lose, Win, Tie],
  ];

  const res = resultMatrix[userMove][botMove];

  return {
    result: ResultStrings[res],
    color: Colors[res],
    description: `〔You ${Emojis[userMove]}〕 ${Compares[res]} 〔Bot ${Emojis[botMove]}〕`,
    res,
  };
}
module.exports = { rpsGame };
