const { Client } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Get embed color
   * @param {string} color - Color input
   * @returns {string} - Return valid color name. If invalid, return 'Random'
   */
  client.getEmbedColor = function getEmbedColor(color) {
    const embedColors = [
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'LuminousVividPink',
      'Fuchsia',
      'Gold',
      'Orange',
      'Purple',
      'DarkAqua',
      'DarkGreen',
      'DarkBlue',
      'DarkPurple',
      'DarkVividPink',
      'DarkGold',
      'DarkOrange',
      'DarkRed',
      'DarkGrey',
      'Navy',
      'Aqua',
      'Blurple',
      'Greyple',
      'DarkButNotBlack',
      'NotQuiteBlack',
      'White',
      'Default',
      'Random',
    ];
    /**
     * Normalize a string
     * @param {string} input - Input string
     * @returns {string} - Normalized string
     */
    function normalized(input) {
      // Remove all spaces and convert to lowercase
      return input.toLowerCase().replace(/\s/g, '');
    }
    // Check valid color name
    for (const colorName of embedColors) {
      if (normalized(colorName) === normalized(color)) return colorName;
    }
    // Return Random if invalid
    return 'Random';
  };
};
