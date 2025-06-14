const { Collection, ChannelType } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const path = require('path');
/**
 * Đọc nội dung thư mục (tệp và/hoặc thư mục con) dựa trên các tùy chọn lọc.
 * Hàm này có thể lấy tất cả nội dung, chỉ thư mục con, hoặc lọc theo phần mở rộng tệp,
 * sau đó áp dụng thêm một hàm lọc tùy chỉnh.
 * @param {String} folderPath Đường dẫn đến thư mục cần đọc.
 * @param {Object} [options={}] Đối tượng chứa các tùy chọn lọc cho quá trình đọc.
 * @param {Boolean|False} [options.all=false] Nếu `true`, hàm sẽ trả về **tất cả** các tệp và thư mục con trong `folderPath`.
 * Tham số này ưu tiên cao nhất, các tùy chọn lọc khác sẽ bị bỏ qua.
 * @param {Boolean|False} [options.isDir=false] Nếu `true`, hàm sẽ chỉ trả về danh sách các **thư mục con** trực tiếp trong `folderPath`.
 * Tham số này ưu tiên thứ hai, chỉ có hiệu lực nếu `all` là `false`.
 * @param {String|.js} [options.extension='.js'] Phần mở rộng của tệp để lọc (ví dụ: `'.js'`, `'.json'`, `'.txt'`).
 * Chỉ áp dụng khi cả `all` và `isDir` đều là `false`. Hàm sẽ trả về các tệp có phần mở rộng này.
 * @param {function(string): boolean} [options.filter] Một hàm lọc tùy chỉnh bổ sung.
 * Hàm này nhận **tên của từng tệp/thư mục** làm đối số (kiểu `string`).
 * Nếu hàm trả về `true`, mục đó sẽ được giữ lại trong danh sách kết quả;
 * nếu trả về `false`, mục đó sẽ bị loại bỏ.
 * Lọc này được áp dụng **sau** bước lọc chính (all/isDir/extension).
 * @returns {string[]} Một mảng chứa tên các tệp hoặc thư mục phù hợp với các điều kiện lọc.
 * Trả về một mảng rỗng (`[]`) nếu thư mục không tồn tại, không thể đọc, hoặc không có mục nào khớp.
 */
function readFiles(folderPath, options = {}) {
  const { all = false, isDir = false, extension = '.js', filter } = options;

  try {
    const allFiles = readdirSync(folderPath);
    let result = [];

    if (all) result = allFiles;
    else if (isDir) result = allFiles.filter((folder) => statSync(path.join(folderPath, folder)).isDirectory());
    else if (extension) {
      result = allFiles.filter((file) => statSync(path.join(folderPath, file)).isFile() && file.endsWith(extension));
    }

    if (filter) {
      if (typeof filter === 'function') result = result.filter(filter);
      else console.warn(chalk.yellow('[Warn] Filter'), filter, chalk.yellow('is not a function'));
    }

    return result;
  } catch (e) {
    const content = (all ? 'contents' : isDir ? 'folders' : `[ ${extension} ]`) + chalk.red(' files from');
    console.error(chalk.red('Error while reading'), content, chalk.green(folderPath), '\n', e);
    return [];
  }
}
// /**
//  * Đọc danh sách các file (.js) hoặc folder.
//  * @param {String|enum} folderPath Đường dẫn thư mục.
//  * @param {String|Boolean|'.js'} [fileType] Loại file (optional):
//  * - `ChannelType.GuildDirectory = 14`: Lọc danh sách các thư mục con trong `folderPath`.
//  * - `true`: Lấy danh sách toàn bộ file/folder trong thư mục.
//  * - Mặc định `'.js'`: Lọc danh sách các file js trong `folderPath`. Ví dụ: `readFiles('functions')`
//  * @param {Boolean|null} [filter] - Lọc theo điều kiện:
//  * - Nếu đặt là `true` sẽ lọc file/folder theo điều kiện truyền vào `fileType`.
//  * - Ví dụ: `readFiles('config', (filter = (f) => f.endsWith('.css')), true)`.
//  * @returns {String[]} Danh sách file/folder.
//  */
// function readFiles(folderPath, fileType = '.js', filter) {
//   try {
//     const readFile = {
//       [ChannelType.GuildDirectory]: () => {
//         // Trả về danh sách các thư mục con
//         let folders = readdirSync(folderPath).filter((folder) => statSync(path.join(folderPath, folder)).isDirectory());
//         // Nếu có filter sẽ lọc theo điều kiện filter truyền vào
//         if (filter) folders = folders.filter(filter);
//         return folders;
//       },
//       true: () => {
//         // Trả về danh sách toàn bộ file và thư mục con
//         return readdirSync(folderPath);
//       },
//       default: () => {
//         // Trả về danh sách các tệp có phần mở rộng fileType hoặc điều kiện lọc filter truyền vào fileType
//         if (filter === true) return readdirSync(folderPath).filter(fileType);
//         else return readdirSync(folderPath).filter((file) => file.endsWith(fileType));
//       },
//     };

//     return (readFile[fileType] || readFile.default)();
//   } catch (e) {
//     const file =
//       fileType === ChannelType.GuildDirectory
//         ? 'directories'
//         : (fileType === true ? '' : `[ ${fileType} ] `) + chalk.red('files');
//     console.error(chalk.red('Error while reading'), file, chalk.red('in'), chalk.green(`${folderPath}\n`), e);
//     return [];
//   }
// }
/**
 * Require file và thêm vào collection tương ứng
 * @param {String} filePath Đường dẫn của file
 * @param {String} folderName Tên folder
 * @param {Collection} collection Collection của file
 * @returns {Object|null} Đối tượng command hoặc null nếu không hợp lệ
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
