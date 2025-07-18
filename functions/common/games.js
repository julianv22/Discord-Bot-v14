const { Colors } = require('discord.js');

module.exports = {
  /** - RPS Game
   * @param {number} userMove - The user's move.
   * @returns {object} - Returns an object containing:
   * - result: The RPS result.
   * - color: The color for the embed.
   * - description: The description for the embed.
   * - res: The numeric RPS result. */
  rpsGame: (userMove) => {
    const botMove = Math.floor(Math.random() * 3);
    /** - RPS Config
     * @typedef {object} rpsConfig
     * @property {object} Emojis - Emojis for each move.
     * @property {object} Results - Numeric RPS results.
     * @property {object} resCompares - Comparison between user and bot.
     * @property {object} ResultStrings - RPS results as strings.
     * @property {object} Colors - Colors for each result. */
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
