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
              logError({
                isWarn: true,
                todo: 'Event',
                item: file,
                desc: `in ${chalk.cyan(folderPath)} is missing 'name' or 'execute' property`,
              });
              continue;
            }
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
          } catch (e) {
            return logError({ todo: 'requiring', item: file, desc: `in ${chalk.yellow(folderPath)}` }, e);
          }
        }
      }

      await envCollection.set(eventFolder, { name: `${capitalize(eventFolder)} [${totalCount}]`, value: eventArray });

      const functions = envCollection.get('functions');
      const events = envCollection.get(eventFolder);

      logAsciiTable([functions.value, events.value], {
        title: 'Load Functions & Events',
        heading: [functions.name, events.name],
      });
    } catch (e) {
      return logError({ item: 'loadEvents', desc: 'function' }, e);
    }
  };
};
