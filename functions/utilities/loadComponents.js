const { Client } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Loads all components (buttons, select menus, modals) from the 'components' folder.
   * @param {string} folderName - Component folder name */
  client.loadComponents = async (folderName) => {
    const { compColection, logError } = client;
    compColection.clear();

    try {
      const componentFolders = readFiles(folderName, { isDir: true });

      for (const folder of componentFolders) {
        const folderPath = path.join(folderName, folder);
        const componentFiles = readFiles(folderPath);

        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), folderName, folder, file);
          requireCommands(filePath, folderName, compColection);
        }
      }
    } catch (e) {
      logError({ item: 'loadComponents', desc: 'function' }, e);
    }
  };
};
