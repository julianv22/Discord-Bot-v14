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
function rpsGame(userMove, bet) {
  const botMove = Math.floor(Math.random() * 3);
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
