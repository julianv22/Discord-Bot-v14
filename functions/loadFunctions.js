const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('./common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadFunctions = () => {
    try {
      const rootDir = path.resolve(__dirname, '..');
      const funcFolder = 'functions';
      const denyList = ['common', 'loadFunctions.js'];

      const table = new ascii()
        .setHeading('Folder', '♻', 'Function Name')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let totalCount = 0;

      const functionFolders = readdirSync(funcFolder);

      for (const folder of functionFolders) {
        if (denyList.includes(folder)) continue;

        const folderPath = path.join(funcFolder, folder);
        const functionFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${functionFiles.length}]`, '─', '─'.repeat(18));

        let sequence = 0;
        for (const file of functionFiles) {
          try {
            const filePath = path.join(rootDir, folderPath, file);

            delete require.cache[require.resolve(filePath)];
            require(filePath)(client);

            table.addRow('', ++sequence, file.split('.')[0]);
            totalCount++;
          } catch (e) {
            console.error(
              chalk.red('Error while requiring function ') + file + chalk.red(' in ') + chalk.green(`${folderPath}\n`),
              e,
            );
          }
        }
      }
      table.setTitle(`Load Functions [${totalCount}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadFunctions\n'), e);
    }
  };
};
