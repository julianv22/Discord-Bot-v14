const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client */
module.exports = (client) => {
  /** @param {Client} client */
  client.loadEvents = async () => {
    try {
      const table = new ascii()
        .setHeading('Folder', '📝', 'Event Name', '♻')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let count = 0;
      let eventFolders = [];
      try {
        eventFolders = readdirSync(`./events`);
      } catch (e) {
        console.error(chalk.yellow('Không thể đọc folder ./events'), e);
        return;
      }
      for (const folder of eventFolders) {
        let eventFiles = [];
        try {
          eventFiles = readdirSync(`./events/${folder}`).filter((f) => f.endsWith('.js'));
        } catch (e) {
          console.error(chalk.yellow(`Không thể đọc folder ./events/${folder}`), e);
          continue;
        }
        table.addRow(`📂 ${folder.toUpperCase()} [${eventFiles.length}]`, '─', '────────────', '📂');

        let i = 1;
        for (const file of eventFiles) {
          try {
            delete require.cache[require.resolve(`../../events/${folder}/${file}`)];
            const event = require(`../../events/${folder}/${file}`);
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));

            table.addRow('', i++, file.split('.')[0], '✅\u200b');
            if (event.name !== file.split('.')[0]) table.addRow('', '', `⤷(${event.name})`, '');
            count++;
          } catch (e) {
            console.error(chalk.yellow(`Lỗi khi load event file: ./events/${folder}/${file}`), e);
          }
        }
      }
      table.setTitle(`Load Events [${count}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while loading events'), e);
    }
  };
};
