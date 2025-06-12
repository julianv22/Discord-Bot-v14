const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('../common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadComponents = async () => {
    try {
      const { buttons, menus, modals } = client;
      const rootDir = path.resolve(__dirname, '..', '..');
      const compntFolder = 'components';
      buttons.clear();
      menus.clear();
      modals.clear();
      const requireComponents = (componentFiles, folder, collection) => {
        try {
          for (const file of componentFiles) {
            const filePath = path.join(rootDir, compntFolder, folder, file);
            delete require.cache[require.resolve(filePath)];
            const component = require(filePath);

            if (component.data && component.data.name) collection.set(component.data.name, component);
            else
              console.warn(
                chalk.yellow('[Warn] Component ') +
                  file +
                  chalk.yellow(' in ') +
                  chalk.green(folder) +
                  chalk.yellow(" is missing 'data' or 'data.name'"),
              );
          }
        } catch (e) {
          console.error(chalk.yellow('Error while requiring components from ') + chalk.green(`${folder}\n`), e);
        }
      };

      const componentFolders = readdirSync(compntFolder);

      const table = new ascii()
        .setHeading('Folder', '♻', 'Component Name')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let totalCount = 0;

      for (const folder of componentFolders) {
        const folderPath = path.join(compntFolder, folder);
        const componentFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${componentFiles.length}]`, '─', '─'.repeat(14));

        let sequence = 0;
        for (const file of componentFiles) {
          table.addRow('', ++sequence, file.split('.')[0]);
          totalCount++;
        }

        const ComponentType = {
          buttons: () => requireComponents(componentFiles, folder, buttons),
          menus: () => requireComponents(componentFiles, folder, menus),
          modals: () => requireComponents(componentFiles, folder, modals),
        };
        ComponentType[folder]();
      }

      table.setTitle(`Load Components [${totalCount}]`);
      console.log(table.toString());
      // End Component Handle
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadComponents function\n'), e);
    }
  };
};
