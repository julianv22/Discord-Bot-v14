const { Client, Collection } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Load commands from ./prefixcommands and ./slashcommands
   * @param {Boolean} [reload = false]  True if reload
   */
  client.loadCommands = async (reload = false) => {
    const { prefixCommands, slashCommands, subCommands } = client;

    prefixCommands.clear();
    slashCommands.clear();
    subCommands.clear();
    /**
     * @typedef {Object} CommandTypeConfig
     * @property {String} name Tên hiển thị của command
     * @property {String} folder Tên thư mục chứa các command
     * @property {Collection} collection Collection dùng để lưu trữ các command
     */
    /**
     * Object chứa cấu hình cho các loại command khác nhau.
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
      Sub: { name: 'Sub Commands', folder: 'slashcommands/subcommands', collection: subCommands },
    };

    const ignoreList = ['subcommands'];
    /**
     * Load các command (Prefix, Slash, Sub)
     * @param {commandTypes} type Loại command trong commandTypes
     */
    async function LoadCommands(type) {
      const table = new ascii()
        .setHeading('Folder', '♻', 'Command Name')
        .setAlignCenter(1)
        .setBorder('│', '─', '✧', '✧');

      let totalCount = 0;
      const commandFolders = readdirSync(type.folder).filter((folder) =>
        statSync(path.join(type.folder, folder)).isDirectory(),
      );

      for (const folder of commandFolders) {
        if (ignoreList.includes(folder)) continue;

        const folderPath = path.join(type.folder, folder);
        const commandFiles = readFiles(folderPath);

        table.addRow(`📂 ${folder.toUpperCase()} [${commandFiles.length}]`, '─', '─'.repeat(12));
        let folderCount = 0;

        for (const file of commandFiles) {
          const filePath = path.join(process.cwd(), folderPath, file);
          const command = requireCommands(filePath, type.folder, type.collection);

          if (command) {
            table.addRow('', ++folderCount, command.data ? command.data.name : command.name);
            totalCount++;
          }
        }
      }
      table.setTitle(`Load ${type.name} [${totalCount}]`);
      console.log(table.toString());
    }

    try {
      await LoadCommands(commandTypes.Prefix);
      await LoadCommands(commandTypes.Slash);
      await LoadCommands(commandTypes.Sub);

      if (!reload) {
        (async () => {
          try {
            const { REST } = require('@discordjs/rest');
            const { Routes } = require('discord-api-types/v10');
            const token = process.env.token || client.token;
            const clientId = process.env.clientID || cfg.clientID;
            const guildId = '1368536666066649148';

            if (!token) throw new Error('Không xác định được token của bot');
            if (!clientId) throw new Error('Không xác định được clientId của bot');

            let slashArray = [];

            for (const command of slashCommands) {
              slashArray.push(command[1].data.toJSON());
            }

            const rest = new REST({ version: 10 }).setToken(token);
            if (clientId === '995949416273940623')
              await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashArray });
            else await rest.put(Routes.applicationCommands(clientId), { body: global.slashArray });

            console.log(chalk.green('\n✅ Successfully loaded application (/) commands.\n'));
          } catch (e) {
            console.error(chalk.yellow('Error while loading application (/) commands to Discord API\n'), e);
          }
        })();
      }
    } catch (e) {
      if (e.rawError && e.rawError.code) console.error(chalk.red(`Mã lỗi Discord API: ${e.rawError.code}`));
      if (e.status) console.error(chalk.red(`Mã trạng thái HTTP: ${e.status}`));
      console.error(chalk.yellow('Error while executing loadCommands function\n'), e);
    }
  };
};
