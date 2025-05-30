const { Client, ActivityType } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Set the presence and activity of the bot
   * @param {Client} client - Client object
   */
  client.setPresence = (client) => {
    const { guilds, user } = client;
    try {
      const count = guilds.cache.map((g) => g).length;
      const activityText = `/help in ${count} server${count > 1 ? 's' : ''}`;
      const [activityTypes, statusTypes] = [
        [ActivityType.Playing, ActivityType.Listening, ActivityType.Watching, ActivityType.Competing],
        ['online', 'dnd', 'idle'],
      ];
      let type_id = Math.floor(Math.random() * activityTypes.length);
      let status_id = Math.floor(Math.random() * statusTypes.length);
      let activities = {
        name: activityText,
        type: activityTypes[type_id],
        url: cfg.youtube,
      };

      user.setPresence({ activities: [activities], status: statusTypes[status_id] });
    } catch (e) {
      console.error(chalk.red('Error while executing function setPresence'), e);
    }
  };
};
