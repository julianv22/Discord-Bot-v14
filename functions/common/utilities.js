const { Collection, SlashCommandSubcommandBuilder, Locale, Colors } = require('discord.js');
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
  /** - Chuyển đổi tiền tệ đơn vị tiền tệ tương ứng
   * @param {number} balance Số tiền
   * @param {Locale} [userLocale] Mã khu vực (vd: `'vi-VN'`) */ toCurrency: (balance, userLocale) => {
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
      return balance.toLocaleString(userLocale, {
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
};
// Start define prototype functions
/** - Chuyển đổi số thành định dạng tiền tệ mặc định là `vi-VN, VND`
 * @param {Locale} [userLocale] Mã khu vực (vd: `'vi-VN'`) */
Number.prototype.toCurrency = function (userLocale) {
  if (!userLocale) return this.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  else return module.exports.toCurrency(this, userLocale);
};
/** - Viết hoa chữ cái đầu */
String.prototype.toCapitalize = function () {
  if (!this) return ''; // Xử lý string rỗng hoặc undefined
  return this.charAt(0).toUpperCase() + this.slice(1);
};
/** - Convert string to EmbedColor */
String.prototype.toEmbedColor = function () {
  // Nomarlize color input
  const normalizedColor = this.toLowerCase().replace(/\s/g, '');
  // Check valid color name
  for (const colorName of Object.keys(Colors)) {
    if (colorName.toLowerCase() === normalizedColor) return colorName;
  }
  // Return Random if invalid
  return 'Random';
};
/** - Check string is URL or not */
String.prototype.checkURL = function () {
  try {
    const res = this.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  } catch (e) {
    _client.logError({ item: 'checkURL', desc: 'function' }, e);
    return null;
  }
};
/** - Nhóm các phần tử trong Collection theo một thuộc tính và trả về danh sách đếm được định dạng.
 * @param {string} [property] Thuộc tính để nhóm các phần tử (mặc định là 'category').
 * - Trả về một mảng các chuỗi được định dạng, ví dụ: `[ '📂 Buttons [7]', '📂 Menus [1]', '📂 Modals [4]' ]` */
Collection.prototype.toGroupedCountList = function (property = 'category') {
  const groupedCounts = this.reduce((acc, item) => {
    acc[item[property]] = (acc[item[property]] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedCounts).map(([name, count]) => `📂 ${name.toCapitalize()} [${count}]`);
};
/** - Chuyển đổi Collection thành định dạng fields cho EmbedBuilder.
 * @param {string} categoryName - Tên category của command.
 * - Trả về một mảng các đối tượng có dạng `{ name: string, value: string }` */
Collection.prototype.toEmbedFields = function (categoryName) {
  return this.filter((cmd) => cmd.category === categoryName).map((cmd) => {
    const subNames = cmd?.data?.options
      ?.filter((opt) => opt instanceof SlashCommandSubcommandBuilder)
      .map((opt) => opt?.name);

    const subTree =
      subNames.length > 0
        ? '\n\x1b[35mSub commands:\x1b[34m\n' +
          subNames
            .map((subName, index, array) => {
              const isLast = index === array.length - 1;
              return (isLast ? '└──' : '├──') + `${cmd?.data?.name} ${subName}`;
            })
            .join('\n')
        : '';

    return {
      name: `/${cmd?.data?.name || cmd?.name}`,
      value: '\n```ansi\n\x1b[36m' + cmd?.data?.description + subTree + '```',
    };
  });
};
// End define prototype functions
