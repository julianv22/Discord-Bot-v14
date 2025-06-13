const { Collection } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const path = require('path');
/**
 * Đọc danh sách các file (.js) hoặc folder
 * @param {String} folderPath Đường dẫn thư mục
 * @param {String|Boolean|'.js'} [fileType] Loại file (optional):
 * - '.js': (mặc định) lọc danh sách các file js
 * - 'dir': lọc danh sách các directory
 * - true: lấy danh sách toàn bộ file/folder trong thư mục
 * @returns {String[]} Danh sách file/folder
 */
function readFiles(folderPath, fileType = '.js') {
  try {
    const readFile = {
      dir: () => {
        // Trả về danh sách các thư mục con
        return readdirSync(folderPath).filter((folder) => statSync(path.join(folderPath, folder)).isDirectory());
      },
      true: () => {
        // Trả về danh sách toàn bộ file và thư mục con
        return readdirSync(folderPath);
      },
      default: () => {
        // Trả về danh sách các tệp có phần mở rộng fileType
        return readdirSync(folderPath).filter((file) => file.endsWith(fileType));
      },
    };

    return (readFile[fileType] || readFile.default)();
  } catch (e) {
    const file =
      fileType === 'dir' ? 'directories' : (fileType === true ? '' : `[ ${fileType} ] `) + chalk.red('files');
    console.error(chalk.red('Error while reading'), file, chalk.red('in'), chalk.green(`${folderPath}\n`), e);
    return [];
  }
}
/**
 * Require file và thêm vào collection tương ứng
 * @param {String} filePath Đường dẫn của file
 * @param {String} folderName Tên folder
 * @param {Collection} collection Collection của file
 * @returns {Object|null} Đối tượng command hoặc null nếu không hợp lệ
 */
function requireCommands(filePath, folderName, collection) {
  try {
    const parts = filePath.split('\\');
    const relativePath = parts.slice(parts.length - 3, parts.length - 1).join('/');

    // Xóa cache để đảm bảo tải lại file nếu có thay đổi (hữu ích cho hot-reloading)
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if (!command) {
      console.warn(
        chalk.yellow('[Warn] Invalid file or empty at'),
        filePath.split('\\').pop(),
        chalk.yellow('in'),
        chalk.green(folderName),
      );
      return null;
    }

    const setCollection = {
      prefixcommands: () => {
        if (command.name) collection.set(command.name, command);
        else
          console.warn(
            chalk.yellow('[Warn] Prefix command'),
            filePath.split('\\').pop(),
            chalk.yellow('in'),
            chalk.green(relativePath),
            chalk.yellow("is missing 'name'"),
          );
      },
      default: () => {
        if (command.data && command.data.name) {
          collection.set(command.data.name, command);
        } else
          console.warn(
            chalk.yellow('[Warn] Command'),
            filePath.split('\\').pop(),
            chalk.yellow('in'),
            chalk.green(relativePath),
            chalk.yellow("is missing 'data' or 'data.name'"),
          );
      },
    };
    (setCollection[folderName] || setCollection.default)();
    return command;
  } catch (e) {
    console.error(
      chalk.red('Error while requiring file'),
      filePath.split('\\').pop(),
      chalk.red('in'),
      chalk.green(`${relativePath}\n`),
      e,
    );
    return null;
  }
}
module.exports = { readFiles, requireCommands };
