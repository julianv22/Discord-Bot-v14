const { Colors } = require('discord.js');

module.exports = {
  /** - RPS Game
   * @param {number} userMove - Nước đi của người dùng
   * @returns {object} - Trả về object gồm:
   * - result: Kết quả RPS
   * - color: Màu sắc cho embed
   * - description: Mô tả cho embed
   * - res: Kết quả RPS dạng số */
  rpsGame: (userMove) => {
    const botMove = Math.floor(Math.random() * 3);
    /** - RPS Config
     * @typedef {object} rpsConfig
     * @property {object} Emojis - Các emoji cho từng nước đi
     * @property {object} Results - Kết quả RPS dạng số
     * @property {object} resCompares - So sánh giữa người dùng và bot
     * @property {object} ResultStrings - Kết quả RPS dạng string
     * @property {object} Colors - Màu sắc cho từng kết quả */
    const rpsConfig = {
      Emojis: { 0: '🔨', 1: '📄', 2: '✂️' },
      Results: { Lose: 0, Tie: 1, Win: 2 },
      resCompares: { 0: '<', 1: '=', 2: '>' },
      resStrings: { 0: 'Lose \\🏳️', 1: 'Tie \\🤝', 2: 'Win \\🎉' },
      resColors: { 0: Colors.Red, 1: Colors.Orange, 2: Colors.Green },
    };

    const {
      Emojis,
      Results: { Tie, Win, Lose },
      resCompares,
      resStrings,
      resColors,
    } = rpsConfig;

    const resultMatrix = [
      [Tie, Lose, Win],
      [Win, Tie, Lose],
      [Lose, Win, Tie],
    ];

    const res = resultMatrix[userMove][botMove];

    return {
      result: resStrings[res],
      color: resColors[res],
      description: `〔You ${Emojis[userMove]}〕 ${resCompares[res]} 〔Bot ${Emojis[botMove]}〕`,
      res,
    };
  },
};
