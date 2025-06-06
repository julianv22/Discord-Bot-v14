const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Load commands from ./prefixcommands and ./slashcommands folders
   * @param {Boolean} reload - True if you want to reload, otherwise false
   * @returns {Promise<void>}
   */
  client.loadCommands = async (reload = false) => {
    try {
      const { prefixCommands, slashCommands, subCommands, slashArray } = client;
      await prefixCommands.clear();
      await slashCommands.clear();
      await subCommands.clear();
      slashArray.length = 0;

      // Prefix Commands
      const prefixCommandFolders = readdirSync('./prefixcommands');
      await LoadCommands('Prefix Command', './prefixcommands', prefixCommandFolders);
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
            const { Routes } = require('discord-api-types/v10');
            const rest = new REST({ version: 10 }).setToken(process.env.token);

            if (!cfg.clientID) throw new Error('clientID is missing in config!');

            await rest.put(Routes.applicationCommands(cfg.clientID), {
              body: slashArray,
            });

            console.log(chalk.yellow('\nSuccessfully reloaded application (/) commands.\n'));
          } catch (e) {
            console.error(chalk.yellow('Error while reloading application (/) command\n'), e);
          }
        })();
      }

      /**
       * @param {String} name - Command name
       * @param {String} folderName - Folder name
       * @param {Array} commandFolders - Array of folders
       */
      async function LoadCommands(name, folderName, commandFolders) {
        const table = new ascii()
          .setHeading('Folder', '🔢', 'Command Name', '♻')
          .setAlignCenter(1)
          .setBorder('│', '─', '✧', '✧');
        let count = 0;

        for (const folder of commandFolders) {
          if (folder === 'subcommands') continue;
          let commandFiles = [];
          try {
            commandFiles = readdirSync(`./${folderName}/${folder}`).filter((f) => f.endsWith('.js'));
          } catch (e) {
            console.error(chalk.yellow(`Không thể đọc folder: [./${folderName}/${folder}]`), e);
            continue;
          }
          table.addRow(`📂 ${folder.toUpperCase()} [${commandFiles.length}]`, '─', '────────────', '📂');

          let i = 1;
          commandFiles.forEach((file) => {
            delete require.cache[require.resolve(`../../${folderName}/${folder}/${file}`)];
            const command = require(`../../${folderName}/${folder}/${file}`);

            if (name === 'Prefix Command') prefixCommands.set(command.name, command);
            else if (name === 'Sub Command') subCommands.set(command.data.name, command);
            else {
              slashCommands.set(command.data.name, command);
              if (!slashArray.some((cmd) => cmd.name === command.data.name)) {
                slashArray.push(command.data.toJSON());
              }
            }

            table.addRow('', i++, command.data ? command.data.name : command.name, '📝');
            count++;
          });
        }
        table.setTitle(`Load ${name}s [${count}]`);
        console.log(table.toString());
      }
    } catch (e) {
      console.error(chalk.yellow('Error while executing function loadCommands\n'), e);
    }
  };
};
