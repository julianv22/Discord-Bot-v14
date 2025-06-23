const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Kiểm tra video mới nhất của các kênh YouTube và gửi thông báo lên kênh thông báo */
  client.checkVideos = async () => {
    /** - Get the latest video of the YouTube channel
     * @param {string} channelId - Channel ID
     * @returns {object} - Return videoId, channelTitle, videoTitle */
    const getLatestVideoId = async (channelId) => {
      try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        if (!res.ok) return { videoId: null, title: null };
        const xml = await res.text();
        const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const titleMatch = xml.match(/<title>(.*?)<\/title>/g);
        // titleMatch[1] là tiêu đề video mới nhất, titleMatch[0] là tiêu đề channel
        const videoTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/<\/?title>/g, '') : null;
        const channelTitle = titleMatch && titleMatch[0] ? titleMatch[0].replace(/<\/?title>/g, '') : null;
        return { videoId: match ? match[1] : null, channelTitle, videoTitle };
      } catch {
        return { videoId: null, channelTitle: null, videoTitle: null };
      }
    };
    try {
      // console.log(chalk.red('Checking videos...'));
      let servers = await serverProfile.find({}).catch(console.error);
      for (const server of servers) {
        const {
          youtube: { channels = [], lastVideos = [], notifyChannel, alert },
          guildID,
        } = server;
        if (!channels.length || !notifyChannel) continue;

        let updated = false;
        for (let i = 0; i < channels.length; i++) {
          const channelId = channels[i];
          const { videoId: latestVideoId, channelTitle, videoTitle } = await getLatestVideoId(channelId);

          if (!latestVideoId) continue;

          // Nếu chưa có lastVideoIds hoặc video mới
          if (!lastVideos[i] || lastVideos[i] !== latestVideoId) {
            lastVideos[i] = latestVideoId;
            updated = true;

            // Gửi thông báo lên kênh
            const guild = client.guilds.cache.get(guildID);

            if (guild) {
              const channel = guild.channels.cache.get(notifyChannel);
              const role = guild.roles.cache.get(alert);
              const videoURL = 'https://youtu.be/' + latestVideoId;

              const embed = new EmbedBuilder()
                .setTitle(videoTitle || 'New video')
                .setColor('Random')
                .setURL(videoURL)
                .setImage(`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`)
                .setFooter({ text: channelTitle || 'Youtube' });

              if (channel) {
                await channel.send({
                  content: `${role ? `${role} ` : ''}\\🎬 **[${
                    channelTitle || 'Youtube Channel'
                  }](https://www.youtube.com/channel/${channelId})** vừa đăng video mới:`,
                  embeds: [embed],
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('🔗Xem trên Youtube').setURL(videoURL),
                    ),
                  ],
                });
              }
            }
          }
        }
        // Lưu lại nếu có cập nhật
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
