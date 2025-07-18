const { Client } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Loads all components (buttons, select menus, modals) from the 'components' folder. */
  client.loadComponents = async () => {
    const { compColection, logError } = client;
    const compFolder = 'components';
    compColection.clear();

    try {
      const componentFolders = readFiles(compFolder, { isDir: true });

      for (const folder of componentFolders) {
        const folderPath = path.join(compFolder, folder);
        const componentFiles = readFiles(folderPath);

        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), compFolder, folder, file);
          requireCommands(filePath, compFolder, compColection);
        }
      }
    } catch (e) {
      logError({ item: 'loadComponents', desc: 'function' }, e);
    }
  };
};
