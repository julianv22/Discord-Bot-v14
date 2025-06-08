const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client - Client object */
module.exports = (client) => {
  client.loadEvents = () => {
    try {
      const table = new ascii()
        .setHeading('Folder', '🔢', 'Event Name', '♻')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');
      let count = 0;
      let eventFolders = [];
      try {
        eventFolders = readdirSync(`./events`);
      } catch (e) {
        console.error(chalk.yellow('Không thể đọc folder [./events]\n'), e);
        return;
      }
      for (const folder of eventFolders) {
        let eventFiles = [];
        try {
          eventFiles = readdirSync(`./events/${folder}`).filter((f) => f.endsWith('.js'));
        } catch (e) {
          console.error(chalk.yellow(`Không thể đọc folder [./events/${folder}]\n`), e);
          continue;
        }
        table.addRow(`📂 ${folder.toUpperCase()} [${eventFiles.length}]`, '─', '─'.repeat(12), '📂');

        let i = 1;
        for (const file of eventFiles) {
          try {
            delete require.cache[require.resolve(`../../events/${folder}/${file}`)];
            const event = require(`../../events/${folder}/${file}`);
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));

            if (event.name !== file.split('.')[0] && i > 1) table.addRow();
            table.addRow(event.name !== file.split('.')[0] ? file.split('.')[0] : '', i++, event.name, '📝');
            count++;
          } catch (e) {
            console.error(chalk.yellow(`Lỗi khi load event file: [./events/${folder}/${file}]\n`), e);
          }
        }
      }
      table.setTitle(`Load Events [${count}]`);
      console.log(table.toString());
    } catch (e) {
      console.error(chalk.yellow('Error while executing loadEvents function\n'), e);
    }
  };
};
