const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client */
module.exports = client => {
  client.loadCommands = async () => {
    try {
      const { prefixCommands, slashCommands, subCommands, slashArray } = client;
      // Prefix Commands
      const prefixCommandFolders =await readdirSync('./prefixcommands');
      await LoadCommands('Command', './prefixcommands', prefixCommandFolders);
      // Slash Commands
      const slashCommandFolders =await readdirSync('./slashcommands');
      await LoadCommands('Slash Command', './slashcommands', slashCommandFolders);
      // Sub Commands
      const subCommandFolders =await readdirSync('./slashcommands/subcommands');
      await LoadCommands('Sub Command', './slashcommands/subcommands', subCommandFolders);

      (async () => {
        try {
          const { REST } = require('@discordjs/rest');
          const { Routes } = require('discord.js');
          const rest = new REST({ version: 10 }).setToken(process.env.token);
          // console.log(chalk.green('\nStarted refreshing application (/) commands.\n'));

          await rest.put(Routes.applicationCommands(cfg.clientID), { body: slashArray });

          console.log(chalk.green('\nSuccessfully reloaded application (/) commands.\n'));
        } catch (e) {
          console.error(chalk.red('Error while reloading application (/) command'), e);
        }
      })();

      /**
       * @param {String} name
       * @param {String} folderName
       * @param {Array} commandFolders
       */
      async function LoadCommands(name, folderName, commandFolders) {
        const table = new ascii()
          .setHeading('Folder', '📝', name + ' Name', '♻')
          .setAlignCenter(1)
          .setBorder('│', '─', '✧', '✧');
        let count = 0;

        for (const folder of commandFolders) {
          if (folder === 'subcommands') continue;

          const commandFiles = await readdirSync(`./${folderName}/${folder}`).filter(f => f.endsWith('.js'));
          table.addRow(`📂 ${folder.toUpperCase()} [${commandFiles.length}]`, '─', '────────────', '📂');

          let i = 1;
          commandFiles.forEach(file => {
            // delete require.cache[require.resolve[file]];
            const command = require(`../../${folderName}/${folder}/${file}`);

            if (name === 'Command') prefixCommands.set(command.name, command);
            else if (name === 'Sub Command') subCommands.set(command.data.name, command);
            else {
              slashCommands.set(command.data.name, command);
              slashArray.push(command.data.toJSON());
            }

            table.addRow('', i++, command.data ? command.data.name : command.name, '✅\u200b');
            count++;
          });
        }
        table.setTitle(`Load ${name}s [${count}]`);
        console.log(table.toString());
      }
    } catch (e) {
      console.error(chalk.red('Error while loading commands'), e);
    }
  };
};
