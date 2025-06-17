const { Client } = require('discord.js');
const path = require('path');
const { readFiles } = require('./common/initLoader');
const { capitalize } = require('./common/miscellaneous');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadFunctions = async () => {
    try {
      const funcFolder = 'functions';
      const ignoreFolders = ['common'];
      const functionFolders = readFiles(funcFolder, {
        isDir: true,
        filter: (folder) => !ignoreFolders.includes(folder),
      });

      let funcArray = [];
      let totalCount = 0;
      for (const folder of functionFolders) {
        const folderPath = path.join(funcFolder, folder);
        const functionFiles = readFiles(folderPath);

        funcArray.push(`📂 ${capitalize(folder)} [${functionFiles.length}]`);
        totalCount += functionFiles.length;

        for (const file of functionFiles) {
          try {
            const filePath = path.join(process.cwd(), folderPath, file);
            delete require.cache[require.resolve(filePath)];
            require(filePath)(client);
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

      await client.envCollection.set(funcFolder, {
        name: `${capitalize(funcFolder)} [${totalCount}]`,
        value: funcArray,
      });
    } catch (e) {
      client.logError({ item: 'loadFunctions', desc: 'function' }, e);
    }
  };
};
