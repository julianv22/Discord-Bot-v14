const { Client, ActivityType } = require('discord.js');

module.exports = client => {
  /** @param {Client} client */
  client.setPresence = async client => {
    try {
      const guilds = client.guilds.cache.map(g => g);
      const activityText = prefix + `help in ${guilds.length} server${guilds.length > 1 ? 's' : ''}`;
      const [activityTypes, statusTypes] = [
        [ActivityType.Playing, ActivityType.Listening, ActivityType.Watching, ActivityType.Competing],
        ['online', 'dnd', 'idle'],
      ];
      let t_id = Math.floor(Math.random() * activityTypes.length);
      let s_id = Math.floor(Math.random() * statusTypes.length);
      let activities = { name: activityText, type: activityTypes[t_id], url: cfg.youtube };

      client.user.setPresence({ activities: [activities], status: statusTypes[s_id] });
    } catch (e) {
      console.error(chalk.yellow.bold('Error while runing setPresence'), e);
    }
  };
};
