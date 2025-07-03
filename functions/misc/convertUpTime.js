const { Client } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Convert uptime to Discord format */
  client.convertUpTime = () => {
    try {
      const { readyTimestamp } = client;
      const uptime = process.uptime();
      const date = new Date(uptime * 1000);
      const days = date.getUTCDate() - 1;
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();

      const time = [];
      if (days > 0) time.push(days + ' day' + (days > 1 ? 's' : ''));
      if (hours > 0) time.push(hours + ' hour' + (hours > 1 ? 's' : ''));
      if (minutes > 0) time.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
      if (seconds > 0) time.push(seconds + ' second' + (seconds > 1 ? 's' : ''));

      let stringTime = days > 0 ? `${time[0]} & ` + time.splice(1).join(', ') : time.join(', ');

      return uptime < 60 ? `<t:${parseInt(readyTimestamp / 1000)}:R>` : stringTime;
    } catch (e) {
      client.logError({ item: 'convertUpTime', desc: 'function' }, e);
    }
  };
};
