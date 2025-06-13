const { Client, Collection } = require('discord.js');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('../common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadComponents = async () => {
    const { buttonCollection, menuCollection, modalCollection } = client;
    const compFolder = 'components';

    buttonCollection.clear();
    menuCollection.clear();
    modalCollection.clear();
    /**
     * Require file và set vào collection tương ứng
     * @param {String[]} componentFiles Danh sách các file component
     * @param {String} folder Thư mục chứa component
     * @param {Collection} collection Collection tương ứng
     */
    const requireComponents = (componentFiles, folder, collection) => {
      try {
        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), compFolder, folder, file);

          delete require.cache[require.resolve(filePath)];
          const component = require(filePath);

          if (component.data && component.data.name) collection.set(component.data.name, component);
          else {
            console.warn(
              chalk.yellow('[Warn] Component'),
              file,
              chalk.yellow('in'),
              chalk.green(folder),
              chalk.yellow("is missing 'data' or 'data.name'"),
            );
            continue;
          }
        }
      } catch (e) {
        console.error(chalk.yellow('Error while requiring components from'), chalk.green(`${folder}\n`), e);
      }
    };

    try {
      const componentFolders = readFiles(compFolder, 'dir');

      const table = new ascii()
        .setHeading('Folder', '♻', 'Component Name')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let totalCount = 0;

      for (const folder of componentFolders) {
        const folderPath = path.join(compFolder, folder);
        const componentFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${componentFiles.length}]`, '─', '─'.repeat(14));

        let sequence = 0;
        for (const file of componentFiles) {
          table.addRow('', ++sequence, file.split('.')[0]);
          totalCount++;
        }

        const ComponentType = {
          buttons: () => requireComponents(componentFiles, folder, buttonCollection),
          menus: () => requireComponents(componentFiles, folder, menuCollection),
          modals: () => requireComponents(componentFiles, folder, modalCollection),
        };
        ComponentType[folder]();
      }

      table.setTitle(`Load Components [${totalCount}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadComponents function\n'), e);
    }
  };
};
