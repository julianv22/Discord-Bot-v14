const { Client } = require('discord.js');
const path = require('path');
const { readFiles } = require('./common/initLoader');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Loads all functions from the 'functions' folder. */
  client.loadFunctions = async () => {
    const { logError } = client;

    try {
      const funcFolder = 'functions';
      const ignoreFolders = ['common'];
      const functionFolders = readFiles(funcFolder, {
        isDir: true,
        filter: (folder) => !ignoreFolders.includes(folder),
      });

      const funcArray = [];
      let totalCount = 0;
      for (const folder of functionFolders) {
        const folderPath = path.join(funcFolder, folder);
        const functionFiles = readFiles(folderPath);

        funcArray.push(`📂 ${folder.toCapitalize()} [${functionFiles.length}]`);
        totalCount += functionFiles.length;

        for (const file of functionFiles) {
          try {
            const filePath = path.join(process.cwd(), folderPath, file);
            delete require.cache[require.resolve(filePath)];
            require(filePath)(client);
          } catch (e) {
            return logError({ todo: 'requiring', item: file, desc: `in ${chalk.yellow(folderPath)}` }, e);
          }
        }
      }

      await client.compColection.set(funcFolder, {
        name: `${funcFolder.toCapitalize()} [${totalCount}]`,
        value: funcArray,
      });
    } catch (e) {
      return logError({ item: 'loadFunctions', desc: 'function loading process' }, e);
    }
  };
};
