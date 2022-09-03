const { Client } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  client.checkURL = function checkURL(strInput) {
    try {
      if (strInput) {
        var res = strInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res !== null;
      } else res;
    } catch (e) {
      console.error(chalk.yellow.bold('checkURL Error:'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
