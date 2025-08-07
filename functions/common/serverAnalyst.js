const { Guild, ActivityType } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { logError } = require('./logging');
const { linkButton } = require('./components');

module.exports = {
  /** - Sets up server statistics channels.
   * @param {Guild} guild - Guild object */
  setStatistics: async (guild) => {
    const profile = await serverProfile.findOne({ guildId: guild.id }).catch(console.error);

    const { statistics } = profile || {};
    if (!profile || !statistics?.totalChannelId || !statistics?.presenceChannelId) return;

    try {
      /** - Sets the name of a channel.
       * @param {string} channelId - The ID of the channel.
       * @param {string} channelName - The new name for the channel. */
      const setChannelName = async (channelId, channelName) =>
        await guild.channels.cache.get(channelId).setName(channelName).catch(console.error);

      const memberCount = guild.members.cache.filter((m) => !m.user.bot).size.toLocaleString(); // Counts members who are not bots in the server
      const botCount = guild.members.cache.filter((m) => m.user.bot).size.toLocaleString(); // Counts the number of bots in the server

      const statsChannels = [
        { id: statistics?.totalChannelId, name: `🌏 Total members: ${guild.memberCount.toLocaleString()}` },
        { id: statistics?.memberChannelId, name: `🤵〔Members〕: ${memberCount}` },
        { id: statistics?.botChannelId, name: `🎯〔Bots〕: ${botCount}` },
      ];

      for (const channel of statsChannels) setChannelName(channel.id, channel.name);

      /** - Gets the number of members with a given presence status.
       * @param {string} status - The member presence status (e.g., 'online', 'idle'). */
      const getPressence = (status) =>
        guild.members.cache.filter((m) => m.presence?.status === status).size.toLocaleString();

      const [icon, status] = [['🟢', '🌙', '⛔', '⚫'], []];
      let i = 0;
      ['online', 'idle', 'dnd', 'offline'].forEach((presence) => status.push(`${icon[i++]} ${getPressence(presence)}`));

      setChannelName(statistics?.presenceChannelId, status.join(' '));
    } catch (e) {
      return logError({ item: 'setStatistics', desc: 'function' }, e);
    }
  },
  /** - Sets the presence and activity of the bot.
   * @param {Client} client - Discord Client */
  setPresence: async (client) => {
    const { guilds, user } = client;

    try {
      const count = guilds.cache.map((g) => g).length;
      const { videoId } = (await module.exports.getLatestVideoId('UC8QPaA8hLDhroGdBtAImmbQ')) || cfg.youtube;
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
      return logError({ item: 'setPresence', desc: 'function' }, e);
    }
  },
  /** Checks for the latest videos from YouTube channels and sends notifications to the designated channel.
   * @param {Client} client - Discord Client */
  checkVideos: async (client) => {
    try {
      const servers = await serverProfile.find({});
      for (const server of servers) {
        const {
          guildId,
          youtube: { channels = [], lastVideos = [], notifyChannelId, alertRoleId },
        } = server;
        if (!channels.length || !notifyChannelId) continue;

        let updated = false;
        for (let i = 0; i < channels.length; i++) {
          const channelId = channels[i];
          const { videoId, channelTitle } = await module.exports.getLatestVideoId(channelId);

          if (!videoId) continue;

          // If there are no lastVideoIds or a new video is found
          if (!lastVideos[i] || lastVideos[i] !== videoId) {
            lastVideos[i] = videoId;
            updated = true;

            // Send notification to the channel
            const guild = client.guilds.cache.get(guildId);

            if (guild) {
              const channel = guild.channels.cache.get(notifyChannelId);
              const role = guild.roles.cache.get(alertRoleId);
              const videoURL = `https://youtu.be/${videoId}`;

              if (channel)
                await channel.send({
                  content: `${role ? `${role} ` : ''}\\🎬 **[${
                    channelTitle || 'Youtube Channel'
                  }](https://www.youtube.com/channel/${channelId})** vừa đăng video mới:\n${videoURL}`,
                  components: [linkButton(videoURL, '🔗 Xem trên Youtube')],
                });
            }
          }
        }
        // Save if there are updates
        if (updated) {
          server.youtube.lastVideos = lastVideos;
          await server.save().catch(console.error);
        }
      }
    } catch (e) {
      return logError({ item: 'checkVideos', desc: 'function' }, e);
    }
  },
  /** - Retrieves the latest video ID and title from a given YouTube channel.
   * @param {string} channelId - The YouTube channel ID. */
  getLatestVideoId: async (channelId) => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

      if (!res.ok) return { videoId: null, channelTitle: null };

      const xml = await res.text();
      const videoIdMatch = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = xml.match(/<title>(.*?)<\/title>/g);
      // titleMatch[1] is the latest video title, titleMatch[0] is the channel title
      // const videoTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/<\/?title>/g, '') : null;
      const channelTitle = titleMatch && titleMatch[0] ? titleMatch[0].replace(/<\/?title>/g, '') : null;

      return { videoId: videoIdMatch ? videoIdMatch[1] : null, channelTitle };
    } catch (error) {
      logError({ todo: 'getting lastest video from YouTube Channel:', item: channelId }, error);
      return { videoId: null, channelTitle: null };
    }
  },
  /** - Gets the title of a YouTube channel.
   * @param {string} channelId - The ID of the YouTube channel.
   * @param {string} apiKey - The API key for YouTube. */
  getChannelTitle: async (channelId, apiKey) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) return data.items[0].snippet.title;
      else return channelId;
    } catch (e) {
      logError({ item: 'getChannelTitle', desc: 'function' }, e);
      return channelId;
    }
  },
};
