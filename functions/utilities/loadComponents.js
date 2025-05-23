const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const { Collection, Client } = require('discord.js');
/**
 * @param {Collection} components - Components object
 * @param {Array} componentFiles - Array of component files
 * @param {String} folder - Folder name
 */
const requireComponents = (components, componentFiles, folder) => {
  try {
    componentFiles.forEach((file) => {
      delete require.cache[require.resolve(`../../components/${folder}/${file}`)];
      const component = require(`../../components/${folder}/${file}`);
      components.set(component.data.name, component);
    });
  } catch (e) {
    console.error(chalk.yellow('[requireComponents]'), e);
  }
};
/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadComponents = async () => {
    try {
      // Start Component Handle
      const componentFolders = readdirSync(`./components`);
      const { buttons, menus, modals } = client;
      await buttons.clear();
      await menus.clear();
      await modals.clear();

      const table = new ascii()
        .setHeading('Folder', '🔢', 'Component Name', '♻')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let count = 0;
      componentFolders.forEach((folder) => {
        let componentFiles = [];
        try {
          componentFiles = readdirSync(`./components/${folder}`).filter((f) => f.endsWith('.js'));
        } catch (e) {
          console.error(chalk.yellow(`Không thể đọc folder: ./components/${folder}`), e);
          return;
        }
        table.addRow(`📂 ${folder.toUpperCase()} [${componentFiles.length}]`, '─', '────────────', '📂');

        let i = 1;
        componentFiles.forEach((file) => {
          table.addRow('', i++, file.split('.')[0], '📝');
          count++;
        });

        const ComponentType = {
          button: () => requireComponents(buttons, componentFiles, folder),
          menu: () => requireComponents(menus, componentFiles, folder),
          modal: () => requireComponents(modals, componentFiles, folder),
        };
        if (typeof ComponentType[folder] === 'function') ComponentType[folder]();
      });

      table.setTitle(`Load Components [${count}]`);
      console.log(table.toString());
      // End Component Handle
    } catch (e) {
      console.error(chalk.yellow('Error while loading components'), e);
    }
  };
};
