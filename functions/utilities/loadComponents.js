const { Client, Collection } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadComponents = async () => {
    const { envCollection } = client;
    envCollection.clear();
    const compFolder = 'components';

    try {
      const componentFolders = readFiles(compFolder, { isDir: true });

      for (const folder of componentFolders) {
        const folderPath = path.join(compFolder, folder);
        const componentFiles = readFiles(folderPath);

        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), compFolder, folder, file);
          requireCommands(filePath, compFolder, envCollection);
        }
      }
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadComponents function\n'), e);
    }
  };
};
