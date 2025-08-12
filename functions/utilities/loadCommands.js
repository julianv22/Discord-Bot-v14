const { Client, Collection, REST, Routes } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');
const { logAsciiTable } = require('../common/utilities');
const { compareCommands } = require('../common/compareCommands');
const { logError } = require('../common/logging');

/** @param {Client} client Discord Client */
module.exports = (client) => {
  /** Loads all commands (slash commands, sub commands, prefix commands) from the 'slashcommands' and the 'prefixcommands' folder. */
  client.loadCommands = async () => {
    const { prefixCommands, slashCommands, subCommands, compColection } = client;

    prefixCommands.clear();
    slashCommands.clear();
    subCommands.clear();
    /** Configuration for a command type.
     * @typedef {Object} CommandTypeProperties
     * @property {string} name The display name of the command type.
     * @property {string} folder The folder containing the commands for this type.
     * @property {Collection<string, object>} collection The collection used to store commands of this type. */

    /** An object containing configurations for different command types.
     * Each property represents a command type (Prefix, Slash, Sub) and contains necessary information for loading and managing them.
     * @type {{
     * Prefix: CommandTypeProperties,
     * Slash: CommandTypeProperties,
     * Sub: CommandTypeProperties
     * }}
     */
    const commandTypes = {
      Prefix: { name: 'Prefix Commands', folder: 'prefixcommands', collection: prefixCommands },
      Slash: { name: 'Slash Commands', folder: 'slashcommands', collection: slashCommands },
      Sub: { name: 'Sub Commands', folder: path.join('slashcommands', 'subcommands'), collection: subCommands },
    };
    /** Loads commands (Prefix, Slash, Sub).
     * @param {CommandTypeProperties} commandType The command type configuration from `commandTypes`. */
    const loadCommands = async (commandType) => {
      const ignoreFolders = ['subcommands'];
      const commandFolders = readFiles(commandType.folder, {
        isDir: true,
        filter: (folder) => !ignoreFolders.includes(folder),
      });

      for (const folder of commandFolders) {
        const folderPath = path.join(commandType.folder, folder);
        const commandFiles = readFiles(folderPath);

        for (const file of commandFiles) {
          const filePath = path.join(process.cwd(), folderPath, file);
          requireCommands(filePath, commandType.folder, commandType.collection);
        }
      }
    };

    await Promise.all([
      loadCommands(commandTypes.Prefix),
      loadCommands(commandTypes.Slash),
      loadCommands(commandTypes.Sub),
    ]);

    logAsciiTable([prefixCommands.toGroupedCountList(), compColection.toGroupedCountList('type')], {
      title: 'Load Prefix Commands & Components',
      heading: [`${commandTypes.Prefix.name} [${prefixCommands.size}]`, `Components [${compColection.size}]`],
    });

    logAsciiTable([slashCommands.toGroupedCountList(), subCommands.toGroupedCountList('parent')], {
      title: 'Load Slash/Sub Commands',
      heading: [`${commandTypes.Slash.name} [${slashCommands.size}]`, `${commandTypes.Sub.name} [${subCommands.size}]`],
    });

    (async () => {
      const token = process.env.token || client.token;
      const clientId = process.env.clientID || client.user.id;
      const guildId = '1388619729429598358'; // Specific Guild ID for the secondary bot
      //1368536666066649148
      if (!token)
        return logError(
          { todo: 'getting bot token', item: 'token', desc: 'from environment variables' },
          new Error('Bot token not found')
        );

      if (!clientId)
        return logError(
          { todo: 'getting bot client ID', item: 'clientID', desc: 'from environment variables' },
          new Error('Bot client ID not found')
        );

      const slashArray = [];
      try {
        for (const command of slashCommands.values()) {
          slashArray.push(command.data.toJSON());
        }
      } catch (e) {
        return logError({ todo: 'pushing', item: 'slashCommands', desc: 'collection toJSON data' }, e);
      }

      try {
        if (slashArray.length > 0) {
          const rest = new REST({ version: '10' }).setToken(token);

          // const commandRoute = Routes.applicationCommands(clientId);
          const commandRoute =
            clientId === '995949416273940623'
              ? Routes.applicationGuildCommands(clientId, guildId)
              : Routes.applicationCommands(clientId);

          const remoteCommands = await rest.get(commandRoute);
          compareCommands(slashArray, remoteCommands);

          const data = await rest.put(commandRoute, { body: slashArray });

          console.log(chalk.green(`\n🔄 Reloaded ${data.length} application (/) commands\n`));
        } else
          logError(
            {
              isWarn: true,
              todo: 'Can not load',
              item: 'application (/) commands',
              desc: `to Discord API: ${chalk.reset(`No data in 'slashArray':`)}`,
            },
            slashArray
          );
      } catch (e) {
        return logError({ todo: 'reloading', item: 'application (/) commands', desc: 'to Discord API' }, e.stack);
      }
    })();
  };
};
