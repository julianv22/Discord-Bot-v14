const { Client, ActivityType } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Set the presence and activity of the bot */
  client.setPresence = async () => {
    const { guilds, user, logError } = client;

    const lastestVideo = async (channelId) => {
      try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

        if (!res.ok) return null;

        const xml = await res.text();
        const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);

        return match ? match[1] : null;
      } catch (e) {
        logError({ todo: 'fetching lastest Youtube video from channelId:', item: channelId }, e);
        return null;
      }
    };

    try {
      const count = guilds.cache.map((g) => g).length;
      const videoId = (await lastestVideo('UC8QPaA8hLDhroGdBtAImmbQ')) || cfg.youtube;
      const url = 'https://www.youtube.com/watch?v=' + videoId;
      const [ActivityTypes, status] = [
        [
          ActivityType.Playing,
          ActivityType.Streaming,
          ActivityType.Listening,
          ActivityType.Watching,
          ActivityType.Competing,
        ],
        ['online', 'dnd', 'idle'],
      ];
      const typeIdx = Math.floor(Math.random() * ActivityTypes.length);
      const statsIdx = Math.floor(Math.random() * status.length);
      const activities = {
        name: `/help in ${count} server${count > 1 ? 's' : ''}`,
        type: ActivityTypes[typeIdx],
        url,
      };

      user.setPresence({ activities: [activities], status: status[statsIdx] });
    } catch (e) {
      logError({ item: 'setPresence', desc: 'function' }, e);
    }
  };
};
