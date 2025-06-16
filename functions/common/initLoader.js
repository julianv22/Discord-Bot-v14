const { Collection } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const path = require('path');
/**
 * Đọc nội dung thư mục (file và/hoặc subfolder) dựa trên các tùy chọn lọc.
 * @param {string} folderPath Đường dẫn đến folder cần đọc.
 * @param {object} [options={}] Đối tượng chứa các tùy chọn lọc cho quá trình đọc.
 * @param {boolean} [options.all] Nếu `true`, hàm sẽ trả về **tất cả** các file và subfolder `folderPath`.
 * @param {boolean} [options.isDir] Nếu `true`, hàm sẽ chỉ trả về danh sách các **subfolder** trong `folderPath`.
 * @param {string} [options.extension] Phần mở rộng của file để lọc (ví dụ: `'.js'`, `'.json'`, `'.txt'`).
 * @param {function(string): boolean} [options.filter] Hàm lọc tùy chỉnh bổ sung (nếu có).
 * Hàm này được áp dụng sau bước lọc chính (all/isDir/extension).
 * @returns {string[]} Array chứa tên các file hoặc folder phù hợp với các điều kiện lọc.
 */
function readFiles(folderPath, options = {}) {
  const { all = false, isDir = false, extension = '.js', filter: func } = options;
  const FileType = all ? 'AllFiles' : isDir ? 'Directories' : extension + ' files';

  const logError = (item, path, e, isWarn = false) => {
    const func = isWarn ? console.warn : console.error;
    const color = isWarn ? 'yellow' : 'red';
    const start = isWarn ? chalk[color]('[Warn]') : chalk[color]('Error');
    const todo = isWarn ? chalk[color]('Custom filter provided for') : chalk[color]('while reading');
    const itemType = isDir ? chalk[color]('folder') : chalk[color]('file');

    if (isWarn) func(start, todo, itemType, chalk[color]('in'), chalk.green(path), chalk[color]('is not a function'));
    else func(start, todo, itemType, `[ ${item} ]`, chalk[color]('in'), chalk.green(`${path}\n`), e);
  };

  try {
    const Read = {
      AllFiles: () => {
        return readdirSync(folderPath);
      },
      Directories: () => {
        return readdirSync(folderPath).filter((folder) => {
          try {
            return statSync(path.join(folderPath, folder)).isDirectory();
          } catch (e) {
            logError(folder, folderPath, e);
            return false;
          }
        });
      },
      default: () => {
        return readdirSync(folderPath).filter((file) => {
          try {
            return statSync(path.join(folderPath, file)).isFile() && file.endsWith(extension);
          } catch (e) {
            logError(file, folderPath, e);
            return false;
          }
        });
      },
    };

    let result = (Read[FileType] || Read.default)();

    if (func)
      if (typeof func === 'function') result = result.filter(func);
      else logError(null, folderPath, null, true);

    return result;
  } catch (e) {
    logError(FileType.toLowerCase(), folderPath, e);
    return [];
  }
}
/**
 * Require file và thêm vào collection tương ứng
 * @param {string} filePath Đường dẫn của file
 * @param {string} folderName Tên folder
 * @param {Collection} collection Collection của file
 * @returns {object|null} Đối tượng command hoặc null nếu không hợp lệ
 */
function requireCommands(filePath, folderName, collection) {
  const parts = filePath.split(path.sep);
  const file = parts.pop();
  const folder = parts.slice(-1);

  try {
    // Xóa cache để đảm bảo tải lại file nếu có thay đổi (hữu ích cho hot-reloading)
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if (!command) {
      console.warn(chalk.yellow('[Warn] Invalid file or empty at'), file, chalk.yellow('in'), chalk.green(folder));
      return null;
    }

    const logWarn = (commandName, errMessage) => {
      let message =
        'is missing ' +
        errMessage
          .split(',')
          .map((m) => `'${m}'`)
          .join(' or ') +
        ' property';
      if (errMessage === 'execute') message = "is missing 'execute' property or is not function";

      console.warn(
        chalk.yellow('[Warn] ' + commandName),
        file,
        chalk.yellow('in'),
        chalk.green(folder),
        chalk.yellow(message),
      );
    };

    const setCollection = {
      prefixcommands: () => {
        if (!command.name) logWarn('Prefix Command', 'name');
        else if (!command.execute || typeof command.execute !== 'function') logWarn('Prefix Command', 'execute');
        else collection.set(command.name, command);
      },
      slashcommands: () => {
        if (!command.data || !command?.data.name) logWarn('Slash Command', 'data,data.name');
        else if (!command.execute || typeof command.execute !== 'function') logWarn('Slash Command', 'execute');
        else collection.set(command.data.name, command);
      },
      [path.join('slashcommands', 'subcommands')]: () => {
        if (!command.parent || !command.data || !command?.data.name) logWarn('Sub Command', 'parent,data,data.name');
        else if (!command.execute || typeof command.execute !== 'function') logWarn('Sub Command', 'execute');
        else collection.set(`${command.parent}|${command.data.name}`, command);
      },
      components: () => {
        if (!command.type || !command.data || !command?.data.name) logWarn('Component', 'type,data,data.name');
        else if (!command.execute || typeof command.execute !== 'function') logWarn('Component', 'execute');
        else collection.set(`${command.type}|${command.data.name}`, command);
      },
    };

    if (!setCollection[folderName]) throw new Error(chalk.yellow(`Invalid folderName ${chalk.green(folderName)}`));
    else setCollection[folderName]();

    return command;
  } catch (e) {
    console.error(chalk.red('Error while requiring file'), file, chalk.red('in'), chalk.green(`${folder}\n`), e);
    return null;
  }
}
module.exports = { readFiles, requireCommands };
