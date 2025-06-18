const { Client } = require('discord.js');
const path = require('path');
const { readFiles } = require('./common/initLoader');
const { capitalize } = require('./common/utilities');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadFunctions = async (reload = false) => {
    const { logError } = client;

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
            return logError({ todo: 'requiring', item: file, desc: `in ${chalk.yellow(folderPath)}` }, e);
          }
        }
      }

      if (!reload)
        await client.envCollection.set(funcFolder, {
          name: `${capitalize(funcFolder)} [${totalCount}]`,
          value: funcArray,
        });
    } catch (e) {
      return logError({ item: 'loadFunctions', desc: 'function' }, e);
    }
  };
};
