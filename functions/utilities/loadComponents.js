const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const { Collection, Client } = require('discord.js');

/**
 * @param {Collection} components
 * @param {String} componentFiles
 * @param {String} folder
 */
requireComponents = (components, componentFiles, folder) => {
  try {
    for (const file of componentFiles) {
      delete require.cache[require.resolve(`../../components/${folder}/${file}`)];
      const component = require(`../../components/${folder}/${file}`);
      components.set(component.data.name, component);
    }
  } catch (e) {
    console.error(chalk.yellow('[requireComponents]'), e);
  }
};

/** @param {Client} client */
module.exports = client => {
  client.loadComponents = async () => {
    try {
      // Start Component Handle
      const componentFolders = await readdirSync(`./components`);
      const table = new ascii().setHeading('Folder', '📝', 'Component Name', '♻').setAlignCenter(1).setBorder('│', '─', '✧', '✧');
      const { buttons, menus, modals } = client;
      await buttons.clear();
      await menus.clear();
      await modals.clear();

      let count = 0;
      for (const folder of componentFolders) {
        const componentFiles = await readdirSync(`./components/${folder}`).filter(f => f.endsWith('.js'));

        table.addRow(`📂 ${folder.toUpperCase()} [${componentFiles.length}]`, '─', '────────────', '📂');

        let i = 1;
        for (const file of componentFiles) {
          table.addRow('', i++, file.split('.')[0], '✅\u200b');
          count++;
        }

        switch (folder) {
          case 'button':
            requireComponents(buttons, componentFiles, folder);
            break;

          case 'menu':
            requireComponents(menus, componentFiles, folder);
            break;

          case 'modal':
            requireComponents(modals, componentFiles, folder);
            break;
        }
      }

      table.setTitle(`Load Components [${count}]`);
      console.log(table.toString());
      // End Component Handle
    } catch (e) {
      console.error(chalk.red('Error while loading components'), e);
    }
  };
};
