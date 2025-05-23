const { Client } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Check if the strInput object is a URL
   * @param {String} strInput - Input string
   * @returns {Boolean} - Return true if strInput is a URL, otherwise return false
   */
  client.checkURL = function checkURL(strInput) {
    try {
      if (strInput) {
        var res = strInput.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        );
        return res !== null;
      } else res;
    } catch (e) {
      console.error(chalk.red('Error while running checkURL'), e);
    }
  };
};
