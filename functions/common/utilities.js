const { Collection, SlashCommandSubcommandBuilder, Locale, Colors } = require('discord.js');
const asciiTable = require('ascii-table');
const { logError } = require('./logging');

module.exports = {
  /** Searches for and replaces variables in a string using a provided replacements object.
   * Variables in the string should be in the format `{key}`.
   * @param {string} stringInput The string containing variables to be replaced.
   * @param {object} replacements An object where keys are variable names and values are their replacements.
   * @example
   * ```js
   * const replaceKey = { user: user.displayName || user.username, guild: guild.name, iconURL: guild.iconURL(), avatar: user.avatarURL() };
   * replaceVar("Hello, {user} from {guild}!", replaceKey);
   * ```
   * @returns {string} The string with variables replaced. */
  replaceVar: (stringInput, replacements) =>
    // Regex will match any string in the format {key}
    stringInput.replace(/\{(\w+)\}/g, (match, key) =>
      // If the key exists in the replacements object, return its value.
      // Otherwise, return the original match to keep that part unchanged.
      replacements[key] !== undefined ? replacements[key] : match
    ),
  /** Logs an array of data into an ASCII table format to the console. Each inner array in `data` represents a column.
   * @param {Array<Array<string>>} data An array of arrays, where each inner array contains data for a column.
   * @param {object} [setting = {}] Optional settings for the ASCII table.
   * @param {string} [setting.title] The title of the ASCII table.
   * @param {string[]} [setting.heading] Column names for the ASCII table. */
  logAsciiTable: (data, seting = {}) => {
    const { title, heading } = seting;

    if (!Array.isArray(data))
      return logError({
        isWarn: true,
        todo: `Type of 'data' is not an array:`,
        item: typeof data,
      });

    for (const dat of data) {
      if (!dat || !Array.isArray(dat))
        return logError({ isWarn: true, todo: `Empty 'data' or type of an item is:`, item: typeof dat });
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
  /** Converts a numeric balance to a localized currency string.
   * @param {number} balance The amount of money to format.
   * @param {Locale} [userLocale = 'VND'] The locale code (e.g., `'en-US'`) to use for formatting. Defaults to `'vi-VN'` if not provided or invalid. */
  toCurrency: (balance, userLocale = 'VND') => {
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
      logError({ todo: 'Error formatting currency for locale', item: userLocale, desc: 'and currency' }, e);
      return balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
  },
};
// Start define prototype functions
/** Converts the number to a currency formatted string. This is a prototype function for `Number`.
 * @param {Locale} [userLocale] The locale code (e.g., `'en-US'`) to use for formatting. Defaults to `'vi-VN'` if not provided. */
Number.prototype.toCurrency = function (userLocale) {
  if (!userLocale) return this.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  else return module.exports.toCurrency(this, userLocale);
};
/** Capitalizes the first letter of the string. This is a prototype function for `String`. */

String.prototype.toCapitalize = function () {
  if (!this) return ''; // Handle empty or undefined string
  return this.charAt(0).toUpperCase() + this.slice(1);
};
/** Converts a string to a Discord EmbedColor. This is a prototype function for `String`.
 * @returns {number} Color of the embed */
String.prototype.toEmbedColor = function () {
  // Normalize color input
  const normalizedColor = this.toLowerCase().replace(/\s/g, '');
  // Check valid color name
  for (const colorName of Object.keys(Colors)) {
    if (colorName.toLowerCase() === normalizedColor) return Colors[colorName];
  }
  // Return Random if invalid
  return Math.floor(Math.random() * 0xffffff);
};
/** Checks if the string is a valid URL. This is a prototype function for `String`. */
String.prototype.checkURL = function () {
  try {
    const res = this.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  } catch (e) {
    logError({ item: 'checkURL', desc: 'function' }, e);
    return false;
  }
};
/** Groups elements within a Collection by a specified property and returns a formatted list of counts. This is a prototype function for `Collection`.
 * @param {string} [property = 'category'] The property by which to group the elements. Defaults to 'category'.
 * @returns {string[]} An array of formatted strings, e.g., `[ '📂 Buttons [7]', '📂 Menus [1]', '📂 Modals [4]' ]`. */
Collection.prototype.toGroupedCountList = function (property = 'category') {
  const groupedCounts = this.reduce((acc, item) => {
    acc[item[property]] = (acc[item[property]] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupedCounts).map(([name, count]) => `📂 ${name.toCapitalize()} [${count}]`);
};
/** Converts a Collection of commands into a format suitable for EmbedBuilder fields. This is a prototype function for `Collection`.
 * @param {string} categoryName The category name to filter commands by.
 * @returns {Array<{name: string, value: string}>} An array of objects, each representing an embed field with command name and description, including subcommands if any. */
Collection.prototype.listCommandsAndSubs = function (categoryName) {
  try {
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
  } catch (e) {
    logError({ item: 'listCommandAndSubs', desc: 'function' }, e);
    return [];
  }
};
/** Converts a Collection of commands into a format suitable for EmbedBuilder fields, grouped by category. This is a prototype function for `Collection`.
 * @param {string} [property = 'category'] The property by which to group the commands. Defaults to 'category'.
 * @returns {Array<{name: string, value: string}>} An array of objects, each representing an embed field with the category name and a list of commands. */
Collection.prototype.listCommands = function (property = 'category') {
  try {
    const commandCat = this.reduce((acc, cmd) => {
      acc[cmd[property]] = (acc[cmd[property]] || 0) + 1;
      return acc;
    }, {});

    const commandFields = [];
    for (const [prop, count] of Object.entries(commandCat)) {
      const cmds = this.filter((cmd) => cmd[property] === prop).map((cmd) => cmd?.data?.name || cmd?.name);

      commandFields.push({
        name: `\\📂 ${prop.toCapitalize()} [${count}]`,
        value: `\`\`\`ansi\n\x1b[36m${cmds.join(' | ')}\x1b[0m\`\`\``,
      });
    }

    return commandFields;
  } catch (e) {
    logError({ item: 'listCommands', desc: 'function' }, e);
    return [];
  }
};
// End define prototype functions
