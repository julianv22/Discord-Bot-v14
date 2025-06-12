const { Client } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('../common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadEvents = () => {
    try {
      const eventFolder = 'events';
      const table = new ascii().setHeading('Folder', '♻', 'Event Name').setAlignCenter(1).setBorder('│', '─', '✧', '✧');
      let totalCount = 0;

      const eventFolders = readdirSync(eventFolder).filter((folder) =>
        statSync(path.join(eventFolder, folder)).isDirectory(),
      );

      for (const folder of eventFolders) {
        const folderPath = path.join(eventFolder, folder);
        const eventFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${eventFiles.length}]`, '─', '─'.repeat(21));

        let sequence = 0;
        for (const file of eventFiles) {
          try {
            const filePath = path.join(process.cwd(), folderPath, file);

            delete require.cache[require.resolve(filePath)];
            const event = require(filePath);

            if (!event.name) {
              console.warn(
                chalk.yellow('[Warn] Event ') +
                  file +
                  chalk.yellow(' in ') +
                  chalk.green(folderPath) +
                  chalk.yellow(" is missing 'event.name'"),
              );
              continue;
            }

            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));

            table.addRow(file.split('.')[0] !== event.name ? '│─' + file.split('.')[0] : '', ++sequence, event.name);
            totalCount++;
          } catch (e) {
            console.error(
              chalk.red('Error while requiring event ') + file + chalk.red(' in ') + chalk.green(`${folderPath}\n`),
              e,
            );
          }
        }
      }
      table.setTitle(`Load Events [${totalCount}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadEvents function\n'), e);
    }
  };
};
