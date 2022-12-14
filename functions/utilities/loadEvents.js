const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client */
module.exports = client => {
  /** @param {Client} client */
  client.loadEvents = async () => {
    try {
      const table = new ascii().setHeading('Folder', '๐', 'Event Name', 'โป').setAlignCenter(1).setBorder('โ', 'โ', 'โง', 'โง');
      let count = 0;
      const eventFolders = readdirSync(`./events`);
      eventFolders.forEach(async folder => {
        const eventFiles = readdirSync(`./events/${folder}`).filter(f => f.endsWith('.js'));
        table.addRow(`๐ ${folder.toUpperCase()} [${eventFiles.length}]`, 'โ', 'โโโโโโโโโโโโ', '๐');

        let i = 1;
        eventFiles.forEach(file => {
          delete require.cache[require.resolve(`../../events/${folder}/${file}`)];
          const event = require(`../../events/${folder}/${file}`);
          if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
          else client.on(event.name, (...args) => event.execute(...args, client));

          table.addRow('', i++, file.split('.')[0], 'โ\u200b');
          if (event.name !== file.split('.')[0]) table.addRow('', '', `โคท(${event.name})`, '');
          count++;
        });
      });
      table.setTitle(`Load Events [${count}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.red('Error while loading events'), e);
    }
  };
};
