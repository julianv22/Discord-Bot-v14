const { Client } = require('discord.js');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles } = require('../common/initLoader');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadEvents = () => {
    const { envCollection } = client;
    try {
      const eventFolder = 'events';
      const eventFolders = readFiles(eventFolder, { isDir: true });

      let eventArray = [];
      let totalCount = 0;
      for (const folder of eventFolders) {
        const folderPath = path.join(eventFolder, folder);
        const eventFiles = readFiles(folderPath);

        eventArray.push(`📂 ${capitalize(folder)} [${eventFiles.length}]`);
        totalCount += eventFiles.length;

        for (const file of eventFiles) {
          try {
            const filePath = path.join(process.cwd(), folderPath, file);
            delete require.cache[require.resolve(filePath)];
            const event = require(filePath);

            if (!event.name || !event.execute) {
              console.warn(
                chalk.yellow('[Warn] Event'),
                file,
                chalk.yellow('in'),
                chalk.green(folderPath),
                chalk.yellow("is missing 'name' or 'execute' property"),
              );
              continue;
            }

            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
          } catch (e) {
            console.error(
              chalk.red('Error while requiring event'),
              file,
              chalk.red('in'),
              chalk.green(`${folderPath}\n`),
              e,
            );
          }
        }
      }

      client.envCollection.set(eventFolder, {
        name: `${capitalize(eventFolder)} [${totalCount}]`,
        value: eventArray,
      });

      const [functions, events] = [envCollection.get('functions'), envCollection.get(eventFolder)];
      const table = new ascii()
        .setTitle('Load Functions & Events')
        .setHeading(functions.name, events.name)
        .setBorder('│', '─', '✧', '✧');

      const maxRows = Math.max(functions.value.length, events.value.length);
      for (let i = 0; i < maxRows; i++) table.addRow(functions.value[i] || '', events.value[i] || '');
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadEvents function\n'), e);
    }
  };
};
