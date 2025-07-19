const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** Checks for the latest videos from YouTube channels and sends notifications to the designated channel. */
  client.checkVideos = async () => {
    /** Gets the latest video ID and channel title from a YouTube channel's RSS feed.
     * @param {string} channelId - The YouTube channel ID. */
    const getLatestVideoId = async (channelId) => {
      try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

        if (!res.ok) return { videoId: null, channelTitle: null };

        const xml = await res.text();
        const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const titleMatch = xml.match(/<title>(.*?)<\/title>/g);
        // titleMatch[1] is the latest video title, titleMatch[0] is the channel title
        // const videoTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/<\/?title>/g, '') : null;
        const channelTitle = titleMatch && titleMatch[0] ? titleMatch[0].replace(/<\/?title>/g, '') : null;

        return { videoId: match ? match[1] : null, channelTitle };
      } catch (error) {
        client.logError({ todo: 'fetching YouTube feed', item: channelId, desc: 'in getLatestVideoId' }, error);
        return { videoId: null, channelTitle: null };
      }
    };
    try {
      let servers = await serverProfile.find({});
      for (const server of servers) {
        const {
          guildId,
          youtube: { channels = [], lastVideos = [], notifyChannelId, alertRoleId },
        } = server;
        if (!channels.length || !notifyChannelId) continue;

        let updated = false;
        for (let i = 0; i < channels.length; i++) {
          const channelId = channels[i];
          const { videoId: latestVideoId, channelTitle } = await getLatestVideoId(channelId);

          if (!latestVideoId) continue;

          // If there are no lastVideoIds or a new video is found
          if (!lastVideos[i] || lastVideos[i] !== latestVideoId) {
            lastVideos[i] = latestVideoId;
            updated = true;

            // Send notification to the channel
            const guild = client.guilds.cache.get(guildId);

            if (guild) {
              const channel = guild.channels.cache.get(notifyChannelId);
              const role = guild.roles.cache.get(alertRoleId);
              const videoURL = `https://youtu.be/${latestVideoId}`;

              if (channel)
                await channel.send({
                  content: `${role ? `${role} ` : ''}\\🎬 **[${
                    channelTitle || 'Youtube Channel'
                  }](https://www.youtube.com/channel/${channelId})** vừa đăng video mới:\n${videoURL}`,
                  components: [
                    new ActionRowBuilder().setComponents(
                      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('🔗Xem trên Youtube').setURL(videoURL)
                    ),
                  ],
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
      client.logError({ item: 'checkVideos', desc: 'function' }, e);
    }
  };
};
