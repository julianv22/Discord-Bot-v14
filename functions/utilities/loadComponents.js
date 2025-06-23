const { Client } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  client.loadComponents = async () => {
    const { envCollection, logError } = client;
    const compFolder = 'components';
    envCollection.clear();

    try {
      const componentFolders = readFiles(compFolder, { isDir: true });

      for (const folder of componentFolders) {
        const folderPath = path.join(compFolder, folder),
          componentFiles = readFiles(folderPath);

        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), compFolder, folder, file);
          requireCommands(filePath, compFolder, envCollection);
        }
      }
    } catch (e) {
      logError({ item: 'loadComponents', desc: 'function' }, e);
    }
  };
};
