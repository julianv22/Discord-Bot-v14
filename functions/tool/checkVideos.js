const fetch = require('node-fetch');
const serverProfile = require('../../config/serverProfile');
const { Client, EmbedBuilder } = require('discord.js');
/**
 * Get the latest video of the YouTube channel
 * @param {String} channelId - Channel ID
 * @returns {Object} - Return videoId, channelTitle, videoTitle
 */
async function getLatestVideoId(channelId) {
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
}
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Kiểm tra video mới nhất của các kênh YouTube và gửi thông báo lên kênh thông báo
   * @returns {Promise<void>}
   */
  client.checkVideos = async () => {
    try {
      // console.log(chalk.red('Checking videos...'));
      const servers = await serverProfile.find({}).catch(() => {});
      for (const server of servers) {
        const { youtubeChannelIds = [], lastVideoIds = [], youtubeNotifyChannel, guildID } = server;
        if (!youtubeChannelIds.length || !youtubeNotifyChannel) continue;

        let updated = false;
        for (let i = 0; i < youtubeChannelIds.length; i++) {
          const channelId = youtubeChannelIds[i];
          const { videoId: latestVideoId, channelTitle, videoTitle } = await getLatestVideoId(channelId);

          if (!latestVideoId) continue;

          // Nếu chưa có lastVideoIds hoặc video mới
          if (!lastVideoIds[i] || lastVideoIds[i] !== latestVideoId) {
            lastVideoIds[i] = latestVideoId;
            updated = true;

            // Gửi thông báo lên kênh
            const guild = client.guilds.cache.get(guildID);
            if (guild) {
              const notifyChannel = guild.channels.cache.get(youtubeNotifyChannel);
              if (notifyChannel) {
                // Thông báo text với tên kênh và link + embed nhúng video
                const embed = new EmbedBuilder()
                  .setTitle(videoTitle || 'Video mới')
                  .setURL(`https://youtu.be/${latestVideoId}`)
                  .setDescription(`[Xem trên YouTube](https://youtu.be/${latestVideoId})`)
                  .setColor('Random')
                  .setImage(`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`)
                  .setFooter({ text: channelTitle || 'Youtube' });
                await notifyChannel.send({
                  content: `\\🎬 **[${
                    channelTitle || 'Youtube Channel'
                  }](https://www.youtube.com/channel/${channelId})** vừa đăng video mới:`,
                  embeds: [embed],
                });
              }
            }
          }
        }
        // Lưu lại nếu có cập nhật
        if (updated) {
          server.lastVideoIds = lastVideoIds;
          await server.save().catch(() => {});
        }
      }
    } catch (e) {
      console.error(chalk.red('Error while running checkVideos'), e);
    }
  };
};
