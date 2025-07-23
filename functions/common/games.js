const { Colors } = require('discord.js');

module.exports = {
  /** - RPS Game
   * @param {number} userMove - The user's move.
   * @returns - Returns an object containing:
   * - result: The RPS result.
   * - color: The color for the embed.
   * - description: The description for the embed.
   * - res: The numeric RPS result. */
  rpsGame: (userMove) => {
    const botMove = Math.floor(Math.random() * 3);
    /** - RPS Config
     * @typedef {object} rpsConfig
     * @property {object} resEmojis - Emojis for each move.
     * @property {object} resTypes - Numeric RPS results.
     * @property {object} resCompares - Comparison between user and bot.
     * @property {object} resStrings - RPS results as strings.
     * @property {object} resColors - Colors for each result. */
    const rpsConfig = {
      resEmojis: { 0: '✊', 1: '🖐️', 2: '✌️' },
      resTypes: { Lose: 0, Tie: 1, Win: 2 },
      resCompares: { 0: '<', 1: '=', 2: '>' },
      resStrings: { 0: 'Lose \\🏳️', 1: 'Tie \\🤝', 2: 'Win \\🎉' },
      resColors: { 0: Colors.Red, 1: Colors.Orange, 2: Colors.Green },
    };

    const {
      resEmojis,
      resTypes: { Tie, Win, Lose },
      resCompares,
      resStrings,
      resColors,
    } = rpsConfig;

    /** - A 3x3 matrix representing the outcomes of a Rock, Paper, Scissors game.
     * - It's used as a lookup table to determine the result from two players' choices.
     * - The indices correspond to the following choices: `0: Rock` | `1: Paper` | `2: Scissors`
     * @example
     * // User chooses Paper (1), Bot chooses Rock (0)
     * const result = resultMatrix[1][0]; // Returns 2 (Win)
     */
    const resultMatrix = [
      [Tie, Lose, Win],
      [Win, Tie, Lose],
      [Lose, Win, Tie],
    ];

    const res = resultMatrix[userMove][botMove];

    return {
      result: resStrings[res],
      color: resColors[res],
      description: `〔You ${resEmojis[userMove]}〕 ${resCompares[res]} 〔Bot ${resEmojis[botMove]}〕`,
      res,
    };
  },
};
