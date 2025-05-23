const { Client } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const ascii = require('ascii-table');
/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadFunctions = async () => {
    try {
      const table = new ascii()
        .setHeading('Folder', '🔢', 'Function Name', '♻')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let count = 0;

      const functionFolders = readdirSync('./functions').filter((f) => {
        try {
          return statSync(`./functions/${f}`).isDirectory();
        } catch {
          return false;
        }
      });
      for (const folder of functionFolders) {
        let functionFiles = [];
        try {
          functionFiles = readdirSync(`./functions/${folder}`).filter((f) => f.endsWith('.js'));
        } catch (e) {
          console.error(chalk.yellow(`Không thể đọc folder ./functions/${folder}`), e);
          continue;
        }
        table.addRow(`📂 ${folder.toUpperCase()} [${functionFiles.length}]`, '─', '────────────', '📂');

        let i = 1;
        for (const file of functionFiles) {
          try {
            delete require.cache[require.resolve(`../functions/${folder}/${file}`)];
            require(`../functions/${folder}/${file}`)(client);
            table.addRow('', i++, file.split('.')[0], '📝');
            count++;
          } catch (e) {
            console.error(chalk.yellow(`Lỗi khi load function file: ./functions/${folder}/${file}`), e);
          }
        }
      }
      table.setTitle(`Load Functions [${count}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while loading functions'), e);
    }
  };
};
