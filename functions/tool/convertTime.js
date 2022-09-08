const { Client } = require('discord.js');

function number(num) {
  return num < 10 ? '0' + num : num;
}
/** @param {Client} client */
module.exports = client => {
  client.convertTime = function convertTime() {
    try {
      const uptime = process.uptime();
      const date = new Date(uptime * 1000);
      const days = date.getUTCDate() - 1,
        hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();

      let time = [];

      if (days == 0) {
        if (hours > 0) time.push(hours + ' h' + (hours > 1 ? 's' : ''));
        if (minutes > 0) time.push(minutes + ' mn' + (minutes > 1 ? 's' : ''));
        if (seconds > 0) time.push(seconds + ' sec' + (seconds > 1 ? 's' : ''));
      } else {
        time.push(days + ' day' + (days > 1 ? 's' : ''));
        time.push(` ${number(hours)}:${number(minutes)}:${number(seconds)}`);
      }

      return days == 0 ? time.join(', ') : time.join(' - ');
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running convertTime'), e);
    }
  };
};
