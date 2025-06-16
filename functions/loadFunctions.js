const { Client } = require('discord.js');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('./common/initLoader');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadFunctions = () => {
    try {
      const funcFolder = 'functions';

      const table = new ascii()
        .setHeading('Folder', '♻', 'Function Name')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');

      const ignoreFolders = ['common'];
      const functionFolders = readFiles(funcFolder, {
        isDir: true,
        filter: (folder) => !ignoreFolders.includes(folder),
      });

      let totalCount = 0;
      for (const folder of functionFolders) {
        const folderPath = path.join(funcFolder, folder);
        const functionFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${functionFiles.length}]`, '─', '─'.repeat(18));

        let sequence = 0;
        for (const file of functionFiles) {
          try {
            const filePath = path.join(process.cwd(), folderPath, file);

            delete require.cache[require.resolve(filePath)];
            require(filePath)(client);

            table.addRow('', ++sequence, file.split('.')[0]);
            totalCount++;
          } catch (e) {
            console.error(
              chalk.red('Error while requiring function'),
              file,
              chalk.red('in'),
              chalk.green(`${folderPath}\n`),
              e,
            );
          }
        }
      }
      table.setTitle(`Load Functions [${totalCount}]`);
      // console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadFunctions\n'), e);
    }
  };
};
