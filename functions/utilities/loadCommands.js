const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client */
module.exports = (client) => {
  client.loadCommands = async (reload = false) => {
    try {
      const { prefixCommands, slashCommands, subCommands, slashArray } = client;
      await prefixCommands.clear();
      await slashCommands.clear();
      await subCommands.clear();

      // Prefix Commands
      const prefixCommandFolders = readdirSync('./prefixcommands');
      await LoadCommands('Command', './prefixcommands', prefixCommandFolders);
      // Slash Commands
      const slashCommandFolders = readdirSync('./slashcommands');
      await LoadCommands('Slash Command', './slashcommands', slashCommandFolders);
      // Sub Commands
      const subCommandFolders = readdirSync('./slashcommands/subcommands');
      await LoadCommands('Sub Command', './slashcommands/subcommands', subCommandFolders);

      if (!reload) {
        (async () => {
          try {
            const { REST } = require('@discordjs/rest');
            const { Routes } = require('discord.js');
            const rest = new REST({ version: 10 }).setToken(process.env.token);
            // console.log(chalk.yellow('\nStarted refreshing application (/) commands.\n'));

            if (!cfg.clientID) throw new Error('clientID is missing in config!');
            await rest.put(Routes.applicationCommands(cfg.clientID), {
              body: slashArray,
            });

            console.log(chalk.yellow('\nSuccessfully reloaded application (/) commands.\n'));
          } catch (e) {
            console.error(chalk.yellow('Error while reloading application (/) command'), e);
          }
        })();
      }

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
          let commandFiles = [];
          try {
            commandFiles = readdirSync(`./${folderName}/${folder}`).filter((f) => f.endsWith('.js'));
          } catch (e) {
            console.error(chalk.yellow(`Không thể đọc folder: ./${folderName}/${folder}`), e);
            continue;
          }
          table.addRow(`📂 ${folder.toUpperCase()} [${commandFiles.length}]`, '─', '────────────', '📂');

          let i = 1;
          commandFiles.forEach((file) => {
            delete require.cache[require.resolve(`../../${folderName}/${folder}/${file}`)];
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
      console.error(chalk.yellow('Error while loading commands'), e);
    }
  };
};
