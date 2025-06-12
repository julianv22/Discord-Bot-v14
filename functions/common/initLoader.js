const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
/**
 * Đọc các file (.js) từ folder
 * @param {String} folderPath Đường dẫn thư mục chứa command
 * @returns {String[]} Danh sách tên file command (kết thúc bằng .js)
 */
const readFiles = (folderPath) => {
  try {
    return readdirSync(folderPath).filter((file) => file.endsWith('.js'));
  } catch (e) {
    console.error(chalk.red(`Cannot read folder ${folderPath}\n`), e);
    return [];
  }
};
/**
 * Require file và thêm vào collection tương ứng
 * @param {String} filePath Đường dẫn của file
 * @param {String} folderName Tên folder
 * @param {Collection} collection Collection của file
 * @returns {Object|null} Đối tượng file hoặc null nếu không hợp lệ
 */
const requireCommands = (filePath, folderName, collection) => {
  try {
    const parts = filePath.split('\\');
    const relativePath = parts.slice(parts.length - 3, parts.length - 1).join('/');

    // Xóa cache để đảm bảo tải lại file nếu có thay đổi (hữu ích cho hot-reloading)
    delete require.cache[require.resolve(filePath)];
    const command = require(filePath);

    if (!command) {
      console.warn(
        chalk.yellow('[Warn] Invalid file or empty at ') +
          filePath.split('\\').pop() +
          chalk.yellow(' in ') +
          chalk.green(folderName),
      );
      return null;
    }

    const setCollection = {
      prefixcommands: () => {
        if (command.name) collection.set(command.name, command);
        else
          console.warn(
            chalk.yellow('[Warn] Prefix command ') +
              filePath.split('\\').pop() +
              chalk.yellow(' in ') +
              chalk.green(relativePath) +
              chalk.yellow(" is missing 'name'"),
          );
      },
      default: () => {
        if (command.data && command.data.name) {
          collection.set(command.data.name, command);
        } else
          console.warn(
            chalk.yellow('[Warn] Command ') +
              filePath.split('\\').pop() +
              chalk.yellow(' in ') +
              chalk.green(relativePath) +
              chalk.yellow(" is missing 'data' or 'data.name'"),
          );
      },
    };
    (setCollection[folderName] || setCollection.default)(folderName);
    return command;
  } catch (e) {
    console.error(
      chalk.red('Error while requiring file ') +
        filePath.split('\\').pop() +
        chalk.red(' in ') +
        chalk.green(`${relativePath}\n`),
      e,
    );
    return null;
  }
};
module.exports = { readFiles, requireCommands };
