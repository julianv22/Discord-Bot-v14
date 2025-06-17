const { Client, Collection, REST, Routes, heading } = require('discord.js');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');
const { ListByFilter, logAsciiTable } = require('../common/miscellaneous');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * Load commands from ./prefixcommands and ./slashcommands
   * @param {boolean} [reload = false]  True if reload
   */
  client.loadCommands = async (reload = false) => {
    const { prefixCommands, slashCommands, subCommands, envCollection, logError } = client;

    prefixCommands.clear();
    slashCommands.clear();
    subCommands.clear();
    /**
     * @typedef {Object} CommandTypeConfig Định nghĩa thuộc tính CommandTypeConfig
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
      Sub: { name: 'Sub Commands', folder: path.join('slashcommands', 'subcommands'), collection: subCommands },
    };
    /**
     * Load các command (Prefix, Slash, Sub)
     * @param {CommandTypeConfig} type Loại command trong commandTypes
     */
    const LoadCommands = async (type) => {
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

    await LoadCommands(commandTypes.Prefix);
    await LoadCommands(commandTypes.Slash);
    await LoadCommands(commandTypes.Sub);

    const slashList = ListByFilter(slashCommands);
    const subList = ListByFilter(subCommands, 'parent');
    const prefixList = ListByFilter(prefixCommands);
    const componentList = ListByFilter(envCollection, 'type');

    logAsciiTable([prefixList, componentList], {
      title: 'Load Prefix Commands & Components',
      heading: [commandTypes.Prefix.name + ` [${prefixCommands.size}]`, 'Components' + ` [${envCollection.size}]`],
    });

    logAsciiTable([slashList, subList], {
      title: 'Load Slash/Sub Commands',
      heading: [commandTypes.Slash.name + ` [${slashCommands.size}]`, commandTypes.Sub.name + ` [${subCommands.size}]`],
    });

    if (!reload) {
      (async () => {
        const token = process.env.token || client.token;
        const clientId = process.env.clientID || cfg.clientID;
        const guildId = '1368536666066649148'; // Guild ID cụ thể cho bot phụ

        if (!token) throw new Error('Không xác định được token của bot');
        if (!clientId) throw new Error('Không xác định được clientId của bot');

        let slashArray = [];
        try {
          for (const command of slashCommands) {
            slashArray.push(command[1].data.toJSON());
          }
        } catch (e) {
          return logError({ todo: 'pushing', item: 'slashCommands', desc: 'collection toJSON data' }, e);
        }

        try {
          if (slashArray.length > 0) {
            const rest = new REST({ version: 10 }).setToken(token);
            let data = [];

            if (clientId === '995949416273940623')
              data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashArray });
            else data = await rest.put(Routes.applicationCommands(clientId), { body: slashArray });

            console.log(chalk.green(`\n🔃 Reloaded ${data.length} application (/) commands\n`));
          } else
            logError(
              {
                todo: 'Can not load',
                item: 'application (/) commands',
                desc: `to Discord API: ${chalk.reset(`No data in 'slashArray':`)}`,
                isWarn: true,
              },
              slashArray,
            );
        } catch (e) {
          return logError({ todo: 'realoading', item: 'application (/) commands', desc: 'to Discord API' }, e);
        }
      })().catch(console.error);
    }
  };
};
