const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const { Collection, Client } = require('discord.js');
/**
 * @param {Collection} components - Đối tượng components
 * @param {Array} componentFiles - Mảng các file component
 * @param {String} folder - Tên folder
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
/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Load các component từ folder ./components
   * @returns {Promise<void>}
   */
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
        ComponentType[folder]();
      });

      table.setTitle(`Load Components [${count}]`);
      console.log(table.toString());
      // End Component Handle
    } catch (e) {
      console.error(chalk.yellow('Error while loading components'), e);
    }
  };
};
