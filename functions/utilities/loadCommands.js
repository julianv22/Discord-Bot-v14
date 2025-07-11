const { Client, Collection, REST, Routes } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');
const { logAsciiTable } = require('../common/utilities');
const { compareCommands } = require('../common/compareCommands');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  client.loadCommands = async () => {
    const { prefixCommands, slashCommands, subCommands, compColection, logError } = client;

    prefixCommands.clear();
    slashCommands.clear();
    subCommands.clear();
    /** - Command types object
     * @typedef {Object} CommandTypeConfig Định nghĩa thuộc tính CommandTypeConfig
     * @property {String} name Tên hiển thị của command
     * @property {String} folder Tên thư mục chứa các command
     * @property {Collection<string, object>} collection Collection dùng để lưu trữ các command
     */
    /** - Object chứa cấu hình cho các loại command khác nhau.
     * Mỗi thuộc tính đại diện cho một loại command (Prefix, Slash, Sub) và chứa các thông tin cần thiết để tải và quản lý chúng.
     * @type {{
     * Prefix: CommandTypeConfig,
     * Slash: CommandTypeConfig,
     * Sub: CommandTypeConfig
     * }}
     */
    const commandTypes = {
      Prefix: { name: 'Prefix Commands', folder: 'prefixcommands', collection: prefixCommands },
      Slash: { name: 'Slash Commands', folder: 'slashcommands', collection: slashCommands },
      Sub: { name: 'Sub Commands', folder: path.join('slashcommands', 'subcommands'), collection: subCommands },
    };
    /** - Load các command (Prefix, Slash, Sub)
     * @param {CommandTypeConfig} type Loại command trong commandTypes
     */
    const loadCommands = async (type) => {
      const ignoreFolders = ['subcommands'];
      const commandFolders = readFiles(type.folder, {
        isDir: true,
        function: (folder) => !ignoreFolders.includes(folder),
      });

      for (const folder of commandFolders) {
        const folderPath = path.join(type.folder, folder);
        const commandFiles = readFiles(folderPath);

        for (const file of commandFiles) {
          const filePath = path.join(process.cwd(), folderPath, file);
          requireCommands(filePath, type.folder, type.collection);
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
      const guildId = '1388619729429598358'; // Guild ID cụ thể cho bot phụ

      if (!token)
        return logError(
          { todo: 'getting bot token', item: 'token', desc: 'from environment variables' },
          new Error('Không xác định được token của bot')
        );

      if (!clientId)
        return logError(
          { todo: 'getting bot client ID', item: 'clientID', desc: 'from environment variables' },
          new Error('Không xác định được clientId của bot')
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

          const commandRoute =
            clientId === '995949416273940623'
              ? Routes.applicationGuildCommands(clientId, guildId)
              : Routes.applicationCommands(clientId);

          const remoteCommands = await rest.get(commandRoute);
          compareCommands(slashArray, remoteCommands);

          const data = await rest.put(commandRoute, { body: slashArray });

          console.log(chalk.green(`\n🔃 Reloaded ${data.length} application (/) commands\n`));
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
