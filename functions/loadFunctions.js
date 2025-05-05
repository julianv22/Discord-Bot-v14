const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client */
module.exports = (client) => {
  /** @param {Client} client */
  client.loadFunctions = async () => {
    try {
      const table = new ascii()
        .setHeading('Folder', '📝', 'Function Name', '♻')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let count = 0;

      const functionFolers = readdirSync('./functions');
      for (const folder of functionFolers) {
        if (folder.endsWith('.js')) continue;

        const functionFiles = readdirSync(`./functions/${folder}`).filter((f) => f.endsWith('.js'));
        table.addRow(`📂 ${folder.toUpperCase()} [${functionFiles.length}]`, '─', '────────────', '📂');

        let i = 1;
        functionFiles.forEach((file) => {
          delete require.cache[require.resolve(`../functions/${folder}/${file}`)];
          require(`../functions/${folder}/${file}`)(client);
          table.addRow('', i++, file.split('.')[0], '✅\u200b');
          count++;
        });
      }
      table.setTitle(`Load Functions [${count}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.red('Error while loading functions'), e);
    }
  };
};
