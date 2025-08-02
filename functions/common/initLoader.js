const { Collection } = require('discord.js');
const path = require('path');
const { readdirSync, statSync } = require('fs');
const { logError } = require('./logging');

module.exports = {
  /** - Object containing filtering options for the reading process.
   * @typedef {object} FilterOptions
   * @property {boolean} [all = false] If `true`, the function will return **all** files and subfolders in `folderPath`.
   * @property {boolean} [isDir = false] If `true`, the function will only return a list of **subfolders** in `folderPath`.
   * @property {string} [extension = '.js'] File extension to filter by (e.g., `'.js'`, `'.json'`, `'.txt'`).
   * @property {function(string): boolean} [filter] Additional custom filter function (if any).
   * - This function is applied after the main filtering step (all/isDir/extension).
   */
  /** - Reads directory contents (files and/or subfolders) based on filtering options.
   * @param {string} folderPath Path to the folder to read.
   * @param {FilterOptions} [options]
   * @returns {string[]} Returns an Array containing the names of files or folders that match the filtering conditions.
   * @example
   * readFiles('slashcommands', { isDir: true, filter: (folder) => !ignoreFolders.includes(folder) });
   */
  readFiles: (folderPath, options = {}) => {
    const { all = false, isDir = false, extension = '.js', filter: func } = options;
    const FileType = all ? 'AllFiles' : isDir ? 'folders' : `[ ${extension} ] files`;

    try {
      const readFiles = {
        AllFiles: () => readdirSync(folderPath),
        folders: () =>
          readdirSync(folderPath).filter((folder) => {
            try {
              return statSync(path.join(folderPath, folder)).isDirectory();
            } catch (e) {
              logError({ todo: 'reading', item: FileType, desc: `in ${chalk.green(folderPath)} folder` }, e);
              return [];
            }
          }),
        default: () =>
          readdirSync(folderPath).filter((file) => {
            try {
              return statSync(path.join(folderPath, file)).isFile() && file.endsWith(extension);
            } catch (e) {
              logError({ todo: 'reading', item: FileType, desc: `in ${chalk.green(folderPath)} folder` }, e);
              return [];
            }
          }),
      };

      let result = (readFiles[FileType] || readFiles.default)();

      if (func)
        if (typeof func === 'function') result = result.filter(func);
        else
          logError(
            {
              isWarn: true,
              todo: 'Custom filter provided for',
              item: FileType,
              desc: `in ${chalk.green(folderPath)} folder is not a function:`,
            },
            typeof func
          );

      return result;
    } catch (e) {
      logError({ todo: 'reading', item: FileType, desc: `in ${chalk.green(folderPath)} folder` }, e);
      return [];
    }
  },
  /** - Requires a file and adds it to the corresponding collection.
   * @param {string} filePath Path to the file.
   * @param {string} folderName Folder name.
   * @param {Collection<string, object>} collection Command Collection. */
  requireCommands: (filePath, folderName, collection) => {
    const parts = filePath.split(path.sep);
    const file = parts.pop();
    const folder = parts.slice(-1);

    /** - Logs a warning to the console when 'name' or 'execute' properties are missing.
     * @param {string} commandType Type of command (Prefix, Slash, Sub, Component).
     * @param {string} parts Missing properties, separated by commas. */
    const missingWarn = (commandType, parts) => {
      let message =
        'is missing ' +
        parts
          .split(',')
          .map((m) => `'${m}'`)
          .join(' or ') +
        ' property';

      if (parts === 'execute') message = "is missing 'execute' property or is not function";

      logError({ isWarn: true, todo: commandType, item: file, desc: `in ${chalk.white(folder)} ${message}` });
    };

    try {
      // Clear cache to ensure file reloads if changes occur (useful for hot-reloading)
      delete require.cache[require.resolve(filePath)];
      const command = require(filePath);

      if (!command)
        return logError({
          isWarn: true,
          todo: 'Invalid or empty file at',
          item: file,
          desc: `in ${chalk.green(folder)} folder`,
        });

      const setCollection = {
        prefixcommands: () => {
          if (!command.name) return missingWarn('Prefix Command', 'name');
          else if (!command.execute || typeof command.execute !== 'function')
            return missingWarn('Prefix Command', 'execute');
          else return collection.set(command.name, command);
        },
        slashcommands: () => {
          if (!command.data || !command?.data.name) return missingWarn('Slash Command', 'data,data.name');
          else if (!command.execute || typeof command.execute !== 'function')
            return missingWarn('Slash Command', 'execute');
          else return collection.set(command.data.name, command);
        },
        [path.join('slashcommands', 'subcommands')]: () => {
          if (!command.parent || !command.data || !command?.data.name)
            return missingWarn('Sub Command', 'parent,data,data.name');
          else if (!command.execute || typeof command.execute !== 'function')
            return missingWarn('Sub Command', 'execute');
          else return collection.set(`${command.parent}|${command.data.name}`, command);
        },
        components: () => {
          if (!command.type || !command.data || !command?.data.name)
            return missingWarn('Component', 'type,data,data.name');
          else if (!command.execute || typeof command.execute !== 'function')
            return missingWarn('Component', 'execute');
          else return collection.set(`${command.type}|${command.data.name}`, command);
        },
      };

      if (!setCollection[folderName]()) throw new Error(chalk.yellow('Invalid folderName'), chalk.green(folderName));
    } catch (e) {
      return logError({ todo: 'requiring file', item: file, desc: `in ${chalk.yellow(folder)} folder` }, e);
    }
  },
};
