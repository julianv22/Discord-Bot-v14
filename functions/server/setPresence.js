const { Client, ActivityType } = require('discord.js');
module.exports = (client) => {
  /**
   * Thiết lập trạng thái và hoạt động của bot
   * @param {Client} client - Đối tượng client
   */
  client.setPresence = async (client) => {
    const { guilds, user } = client;
    try {
      const count = await guilds.cache.map((g) => g).length;
      const activityText = `/help in ${count} server${count > 1 ? 's' : ''}`;
      const [activityTypes, statusTypes] = [
        [ActivityType.Playing, ActivityType.Listening, ActivityType.Watching, ActivityType.Competing],
        ['online', 'dnd', 'idle'],
      ];
      let t_id = Math.floor(Math.random() * activityTypes.length);
      let s_id = Math.floor(Math.random() * statusTypes.length);
      let activities = {
        name: activityText,
        type: activityTypes[t_id],
        url: cfg.youtube,
      };

      user.setPresence({ activities: [activities], status: statusTypes[s_id] });
    } catch (e) {
      console.error(chalk.red('Error while running setPresence'), e);
    }
  };
};
