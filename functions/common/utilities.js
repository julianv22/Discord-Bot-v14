const serverProfile = require('../../config/serverProfile');
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
      let res = strInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      );
      return res !== null;
    }
  } catch (e) {
    console.error(chalk.red('Error while executing function checkURL'), e);
  }
}
/**
 * Tìm kiếm và thay thế các biến trong chuỗi
 * @param {string} str - String cần thay thế
 * @param {Object} replacements - Object chứa các biến và giá trị tương ứng
 * @returns {string} - String đã được thay thế
 */
function replaceVar(str, replacements) {
  // Regex sẽ khớp với bất kỳ chuỗi nào trong dạng {key}
  // Ví dụ: {user}, {guild}, {avatar}
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    // Nếu key tồn tại trong đối tượng replacements, trả về giá trị đó.
    // Nếu không, trả về lại match gốc để không thay đổi phần đó.
    return replacements[key] !== undefined ? replacements[key] : match;
  });
}
/**
 * Viết hoa chữ cái đầu tiên của string
 * @param {String} str - String cần viết hoa
 * @returns {String} - String đã được viết hoa
 */
function capitalize(str) {
  if (!str) return ''; // Xử lý string rỗng hoặc undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = { getLatestVideoId, checkURL, replaceVar, capitalize };
