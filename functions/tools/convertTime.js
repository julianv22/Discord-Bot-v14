const { Client } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  client.convertTime = function convertTime() {
    try {
      var uptime = process.uptime();
      const date = new Date(uptime * 1000);
      const days = date.getUTCDate() - 1,
        hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();

      let time = '';

      function number(num) {
        return num < 10 ? '0' + num : num;
      }

      if (days > 0) time += days + ' day' + (days == 1 ? '' : 's');
      time += ` ${number(hours)}:${number(minutes)}:${number(seconds)}`;

      return time;
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running convertTime'), e);
    }
  };
};
