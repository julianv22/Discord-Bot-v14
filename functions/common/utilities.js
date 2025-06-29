const { Client, Collection, Locale, Colors } = require('discord.js');
const asciiTable = require('ascii-table');
const path = require('path');

let _client;

module.exports = {
  /** @param {Client} client Discord Client */
  init: (client) => (_client = client),
  logError: (...args) => {
    if (!_client)
      return console.error(
        chalk.red('Client not initialized for'),
        chalk.green(path.join('functions', 'common', 'utilities.js'))
      );
    _client.logError(...args);
  },
  /** - Chuyển đổi tiền tệ đơn vị tiền tệ tương ứng
   * @param {number} balance Số tiền
   * @param {Locale|'vi-VN'} [userLocale] Mã khu vực (vd: `'vi-VN'`) */
  toCurrency: (balance, userLocale = 'vi-VN') => {
    const CurrencyMap = {
      'en-US': 'USD', // Tiếng Anh (Mỹ) -> Đô la Mỹ
      'en-GB': 'VND', // Tiếng Anh (Anh) -> Đô la Mỹ
      'vi-VN': 'VND', // Tiếng Việt -> Đồng Việt Nam
      ja: 'JPY', // Tiếng Nhật -> Yên Nhật
      'zh-CN': 'CNY', // Tiếng Trung giản thể (Trung Quốc) -> Nhân dân tệ
      ko: 'KRW', // Tiếng Hàn -> Won Hàn Quốc
      fr: 'EUR', // Tiếng Pháp (hoặc các ngôn ngữ châu Âu khác) -> Euro
      de: 'EUR', // Tiếng Đức -> Euro
      'es-ES': 'EUR', // Tiếng Tây Ban Nha -> Euro
    };

    try {
      return balance.toLocaleString('vi-VN' /** userLocale */, {
        style: 'currency',
        currency: CurrencyMap[userLocale] || 'VND',
        minimumFractionDigits: 0, // Điều chỉnh số chữ số thập phân tối thiểu
        maximumFractionDigits: 2, // Điều chỉnh số chữ số thập phân tối đa
      });
    } catch (e) {
      _client.logError({ todo: 'Lỗi định dạng số tiền cho locale', item: userLocale, desc: 'và tiền tệ' }, e);
      return balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  },
  /** - Lấy video mới nhất từ các kênh Youtube
   * @param {string} channelId - Youtube channelId */
  getLatestVideoId: async (channelId) => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

      if (!res.ok) return { videoId: null, title: null };

      const xml = await res.text();
      const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = xml.match(/<title>(.*?)<\/title>/g); // titleMatch[1] là tiêu đề video mới nhất, titleMatch[0] là tiêu đề channel
      const videoTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/<\/?title>/g, '') : null;
      const channelTitle = titleMatch && titleMatch[0] ? titleMatch[0].replace(/<\/?title>/g, '') : null;

      return { videoId: match ? match[1] : null, channelTitle, videoTitle };
    } catch {
      return { videoId: null, channelTitle: null, videoTitle: null };
    }
  },
  /** - Check URL, returns true if the string is a valid URL, otherwise return false
   * @param {string} stringInput - String input */
  checkURL: (stringInput) => {
    try {
      if (stringInput) {
        let res = stringInput.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        );
        return res !== null;
      }
      return false;
    } catch (e) {
      _client.logError({ item: 'checkURL', desc: 'function' }, e);
      return null;
    }
  },
  /** - Get embed color, returns valid color name. If invalid, return 'Random'
   * @param {string} color - Color input */
  getEmbedColor: (color) => {
    // Nomarlize color input
    const normalizedColor = color.toLowerCase().replace(/\s/g, '');

    // Check valid color name
    for (const colorName of Object.keys(Colors)) {
      if (colorName.toLowerCase() === normalizedColor) return colorName;
    }

    return 'Random'; // Return Random if invalid
  },
  /** - Tìm kiếm và thay thế các biến trong chuỗi
   * @param {string} stringInput String cần thay thế
   * @param {object} replacements Object chứa các biến và giá trị tương ứng
   * - Ví dụ: ```const replaceKey = { user: user.displayName || user.username, guild: guild.name, iconURL: guild.iconURL(), avatar: user.avatarURL() };``` */
  replaceVar: (stringInput, replacements) => {
    // Regex sẽ khớp với bất kỳ chuỗi nào trong dạng {key}
    // Ví dụ: {user}, {guild}, {avatar}
    return stringInput.replace(/\{(\w+)\}/g, (match, key) => {
      // Nếu key tồn tại trong đối tượng replacements, trả về giá trị đó.
      // Nếu không, trả về lại match gốc để không thay đổi phần đó.
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  },
  /** - Viết hoa chữ cái đầu tiên của string
   * @param {string} string - String cần viết hoa */
  capitalize: (string) => {
    if (!string) return ''; // Xử lý string rỗng hoặc undefined
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  /** - Thống kê các command từ Collection ra mảng
   * @param {Collection<string, object>} collection Command collection
   * @param {string} [property] Bộ lọc theo key của collection
   * - Returns mảng danh sách command đã được thống kê theo key
   * - Ví dụ: `[ '📂 Buttons [7]', '📂 Menus [1]', '📂 Modals [4]' ]` */
  listByFilter: (collection, property = 'category') => {
    const commandFilter = collection.reduce((acc, cmd) => {
      acc[cmd[property]] = (acc[cmd[property]] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(commandFilter).map(([name, count]) => `📂 ${module.exports.capitalize(name)} [${count}]`);
  },
  /** - Log 2 mảng dữ liệu ra asciiTable
   * @param {string[]} data Mảng dữ liệu
   * @param {object} [seting] Các thuộc tính của bảng asciiTable
   * @param {string} [seting.title] `table.setTitle` Tiêu đề của bảng asciiTable
   * @param {string[]} [seting.heading] `table.setHeading` Tên các cột của bảng asciiTable */
  logAsciiTable: (data, seting = {}) => {
    const { title, heading } = seting;

    if (!Array.isArray(data))
      return _client.logError({
        isWarn: true,
        todo: `Type of 'data' is not an array:`,
        item: typeof data,
      });

    for (const dat of data) {
      if (!dat || !Array.isArray(dat))
        return _client.logError({ isWarn: true, todo: `Empty 'data' or type of an item is:`, item: typeof dat });
    }

    const table = new asciiTable().setBorder('│', '─', '✧', '✧');
    if (title) table.setTitle(title);
    if (heading) table.setHeading(heading);

    const maxRows = Math.max(...data.map((col) => col.length));
    for (let i = 0; i < maxRows; i++) {
      table.addRow(...(data.map((col) => col[i]) || ''));
    }
    console.log(table.toString());
  },
};
