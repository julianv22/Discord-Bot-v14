const { Client, ActivityType } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Set the presence and activity of the bot
   * @param {Client} client - Discord Client */
  client.setPresence = (client) => {
    const { guilds, user } = client;
    try {
      const count = guilds.cache.map((g) => g).length;
      const [type, status] = [
        [
          ActivityType.Playing,
          ActivityType.Streaming,
          ActivityType.Listening,
          ActivityType.Watching,
          ActivityType.Competing,
        ],
        ['online', 'dnd', 'idle'],
      ];
      let typeIndex = Math.floor(Math.random() * type.length);
      let statusIndex = Math.floor(Math.random() * status.length);
      let activities = {
        name: `/help in ${count} server${count > 1 ? 's' : ''}`,
        type: type[typeIndex],
        url: cfg.youtube,
      };

      user.setPresence({ activities: [activities], status: status[statusIndex] });
    } catch (e) {
      client.logError({ item: 'setPresence', desc: 'function' }, e);
    }
  };
};
