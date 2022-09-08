const { Client } = require('discord.js');

function number(num) {
  return num < 10 ? '0' + num : num;
}
/** @param {Client} client */
module.exports = client => {
  client.convertTime = function convertTime(hms) {
    try {
      var res;
      var uptime = process.uptime();
      const date = new Date(uptime * 1000);
      const days = date.getUTCDate() - 1,
        hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();

      let time;

      if (hms) {
        time = '';
        if (days > 0) time += days + ' day' + (days == 1 ? '' : 's');
        time += ` ${number(hours)}:${number(minutes)}:${number(seconds)}`;
        res = time;
      } else {
        // console.log('Uptime raw:', uptime);
        const date = new Date(uptime * 1000);
        const days = date.getUTCDate() - 1,
          hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds();

        time = [];

        if (days > 0) time.push(days + ' day' + (days == 1 ? '' : 's'));
        if (hours > 0) time.push(hours + ' h' + (hours == 1 ? '' : 's'));
        if (minutes > 0) time.push(minutes + ' mn' + (minutes == 1 ? '' : 's'));
        if (seconds > 0) time.push(seconds + ' s'); // + (seconds == 1 ? '' : 's'));
        // if (milliseconds > 0) time.push(milliseconds.toFixed(2) + ' ms' + (seconds == 1 ? '' : 's'));
        const dateString = time.join(', ');
        // console.log('Uptime: ' + dateString);
        res = dateString;
      }

      return res;
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running convertTime'), e);
    }
  };
};
