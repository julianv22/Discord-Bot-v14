const { Client } = require('discord.js');
const path = require('path');
const { readFiles } = require('../common/initLoader');
const { capitalize, logAsciiTable } = require('../common/utilities');

/** @param {Client} client - Client */
module.exports = (client) => {
  client.loadEvents = async () => {
    const { envCollection, logError } = client;
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

      await envCollection.set(eventFolder, { name: `${capitalize(eventFolder)} [${totalCount}]`, value: eventArray });

      const [functions, events] = [envCollection.get('functions'), envCollection.get(eventFolder)];
      logAsciiTable([functions.value, events.value], {
        title: 'Load Functions & Events',
        heading: [functions.name, events.name],
      });
    } catch (e) {
      logError({ item: 'loadEvents', desc: 'function' }, e);
    }
  };
};
