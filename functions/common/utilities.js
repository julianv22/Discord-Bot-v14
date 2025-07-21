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
  /** - Gets the latest video from YouTube channels.
   * @param {string} channelId - YouTube channel ID. */
  getLatestVideoId: async (channelId) => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

      if (!res.ok) return { videoId: null, title: null };

      const xml = await res.text();
      const match = xml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = xml.match(/<title>(.*?)<\/title>/g); // titleMatch[1] is the latest video title, titleMatch[0] is the channel title
      const videoTitle = titleMatch && titleMatch[1] ? titleMatch[1].replace(/<\/?title>/g, '') : null;
      const channelTitle = titleMatch && titleMatch[0] ? titleMatch[0].replace(/<\/?title>/g, '') : null;

      return { videoId: match ? match[1] : null, channelTitle, videoTitle };
    } catch {
      return { videoId: null, channelTitle: null, videoTitle: null };
    }
  },
  /** - Searches for and replaces variables in a string.
   * @param {string} stringInput The string to replace variables in.
   * @param {object} replacements An object containing variables and their corresponding values.
   * - Example: ```const replaceKey = { user: user.displayName || user.username, guild: guild.name, iconURL: guild.iconURL(), avatar: user.avatarURL() };``` */
  replaceVar: (stringInput, replacements) => {
    // Regex will match any string in the format {key}
    // Example: {user}, {guild}, {avatar}
    return stringInput.replace(/\{(\w+)\}/g, (match, key) => {
      // If the key exists in the replacements object, return its value.
      // Otherwise, return the original match to keep that part unchanged.
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  },
  /** - Logs two arrays of data into an asciiTable.
   * @param {string[]} data Array of data.
   * @param {object} [seting] Properties for the asciiTable.
   * @param {string} [seting.title] `table.setTitle` Title of the asciiTable.
   * @param {string[]} [seting.heading] `table.setHeading` Column names for the asciiTable. */
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
  /** - Converts currency to the corresponding unit.
   * @param {number} balance The amount of money.
   * @param {Locale} [userLocale] Locale code (e.g., `'en-US'`). */ toCurrency: (balance, userLocale) => {
    const CurrencyMap = {
      'en-US': 'USD', // English (US) -> US Dollar
      'en-GB': 'GBP', // English (UK) -> British Pound
      'vi-VN': 'VND', // Vietnamese -> Vietnamese Dong
      ja: 'JPY', // Japanese -> Japanese Yen
      'zh-CN': 'CNY', // Simplified Chinese (China) -> Chinese Yuan
      ko: 'KRW', // Korean -> Korean Won
      fr: 'EUR', // French (or other European languages) -> Euro
      de: 'EUR', // German -> Euro
      'es-ES': 'EUR', // Spanish -> Euro
    };

    try {
      return balance.toLocaleString(userLocale, {
        style: 'currency',
        currency: CurrencyMap[userLocale] || 'VND',
        minimumFractionDigits: 0, // Adjust minimum decimal places
        maximumFractionDigits: 2, // Adjust maximum decimal places
      });
    } catch (e) {
      _client.logError({ todo: 'Error formatting currency for locale', item: userLocale, desc: 'and currency' }, e);
      return balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  },
};
// Start define prototype functions
/** - Converts a number to currency format, defaulting to `vi-VN, VND`.
 * @param {Locale} [userLocale] Locale code (e.g., `'en-US'`). */
Number.prototype.toCurrency = function (userLocale) {
  if (!userLocale) return this.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  else return module.exports.toCurrency(this, userLocale);
};
/** - Capitalizes the first letter of a string. */
String.prototype.toCapitalize = function () {
  if (!this) return ''; // Handle empty or undefined string
  return this.charAt(0).toUpperCase() + this.slice(1);
};
/** - Converts string to EmbedColor. */
String.prototype.toEmbedColor = function () {
  // Normalize color input
  const normalizedColor = this.toLowerCase().replace(/\s/g, '');
  // Check valid color name
  for (const colorName of Object.keys(Colors)) {
    if (colorName.toLowerCase() === normalizedColor) return colorName;
  }
  // Return Random if invalid
  return Math.random() * 0xffffff;
};
/** - Checks if a string is a URL. */
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
/** - Groups elements in a Collection by a property and returns a formatted count list.
 * @param {string} [property] The property to group elements by (defaults to 'category').
 * - Returns an array of formatted strings, e.g., `[ '📂 Buttons [7]', '📂 Menus [1]', '📂 Modals [4]' ]`. */
Collection.prototype.toGroupedCountList = function (property = 'category') {
  const groupedCounts = this.reduce((acc, item) => {
    acc[item[property]] = (acc[item[property]] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedCounts).map(([name, count]) => `📂 ${name.toCapitalize()} [${count}]`);
};
/** - Converts a Collection into fields format for EmbedBuilder.
 * @param {string} categoryName - The category name of the command.
 * - Returns an array of objects in the format `{ name: string, value: string }`. */
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
