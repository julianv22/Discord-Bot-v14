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
  const { all = false, isDir = false, extension = '.js', filter } = options;
  const FileType = all ? 'AllFiles' : isDir ? 'Directories' : `[ ${extension} ] files`;

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
            console.error(
              chalk.red('Error while reading folder'),
              folder,
              chalk.red('from'),
              chalk.green(`${folderPath}\n`),
              e,
            );
            return false;
          }
        });
      },
      default: () => {
        return readdirSync(folderPath).filter((file) => {
          try {
            return statSync(path.join(folderPath, file)).isFile() && file.endsWith(extension);
          } catch (e) {
            console.warn(
              chalk.red('Error while reading file'),
              file,
              chalk.red('from'),
              chalk.green(`${folderPath}\n`),
              e,
            );
            return false;
          }
        });
      },
    };

    let result = (Read[FileType] || Read.default)();

    if (filter)
      if (typeof filter === 'function') result = result.filter(filter);
      else
        console.warn(
          chalk.yellow('[Warn] Filter of'),
          FileType.toLowerCase(),
          chalk.yellow('in'),
          chalk.green(folderPath),
          chalk.yellow('folder is not a function:\n'),
          chalk.cyan(filter),
        );

    return result;
  } catch (e) {
    console.error(
      chalk.red('Error while reading'),
      FileType.toLowerCase(),
      chalk.red('from'),
      chalk.green(`${folderPath}\n`),
      e,
    );
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
  const parts = filePath.split('\\');
  const relativePath = parts.slice(parts.length - 3, parts.length - 1).join('\\');

  try {
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
        if (command.name && command.execute) collection.set(command.name, command);
        else
          console.warn(
            chalk.yellow('[Warn] Prefix command'),
            filePath.split('\\').pop(),
            chalk.yellow('in'),
            chalk.green(relativePath),
            chalk.yellow("is missing 'name' or 'execute' property"),
          );
      },
      default: () => {
        if (command.data && command.data.name && command.execute) {
          collection.set(command.data.name, command);
        } else
          console.warn(
            chalk.yellow('[Warn] Command'),
            filePath.split('\\').pop(),
            chalk.yellow('in'),
            chalk.green(relativePath),
            chalk.yellow("is missing 'data.name' or 'execute' property"),
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
