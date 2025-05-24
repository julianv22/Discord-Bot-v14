const fetch = require('node-fetch');
const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder } = require('discord.js');
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

/**
 * Check URL
 * @param {String} strInput - String input
 * @returns {Boolean} - Return true if the string is a valid URL, otherwise return false
 */
function checkURL(strInput) {
  try {
    if (strInput) {
      var res = strInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      );
      return res !== null;
    } else res;
  } catch (e) {
    console.error(chalk.red('Error while running checkURL'), e);
  }
}
module.exports = { getLatestVideoId, checkURL };
