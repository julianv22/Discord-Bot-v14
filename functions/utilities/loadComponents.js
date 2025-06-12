const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('../common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadComponents = async () => {
    const { buttons, menus, modals } = client;
    const compntFolder = 'components';

    buttons.clear();
    menus.clear();
    modals.clear();
    /**
     * Require file và set vào collection tương ứng
     * @param {String[]} componentFiles Danh sách các file component
     * @param {String} folder Thư mục chứa component
     * @param {Collection} collection Collection tương ứng
     */
    const requireComponents = (componentFiles, folder, collection) => {
      try {
        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), compntFolder, folder, file);
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

    try {
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
          if (!file.endsWith('.js')) {
            console.warn(chalk.yellow(`Bỏ qua ${file} không phải .js trong ${folderPath}`));
            continue;
          }

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
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadComponents function\n'), e);
    }
  };
};
