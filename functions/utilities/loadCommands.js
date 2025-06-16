const { Client, Collection, REST, Routes, heading } = require('discord.js');
const ascii = require('ascii-table');
const path = require('path');
const { readFiles, requireCommands } = require('../common/initLoader');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * Load commands from ./prefixcommands and ./slashcommands
   * @param {boolean} [reload = false]  True if reload
   */
  client.loadCommands = async (reload = false) => {
    const { prefixCommands, slashCommands, subCommands, envCollection } = client;

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
    /**
     * List command filter by property
     * @param {Collection<string, object} command Command's collection
     * @param {string|'category'} [property] Property filter
     * @returns {string[]} Command name with count array filtered by property
     */
    const ListByFilter = (command, property = 'category') => {
      const commandFilter = Array.from(command.values()).reduce((acc, cmd) => {
        acc[cmd[property]] = (acc[cmd[property]] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(commandFilter).map(([name, count]) => `📂 ${capitalize(name)} [${count}]`);
    };
    /**
     *
     * @param {Array<string>[]} data Array of 2 commands
     * @param {object} options Ascii table options
     * @param {string} options.title table.setTitle
     * @param {string[]} options.heading table.setHeading
     */
    const logAsciiTable = (data, { title, heading }) => {
      const table = new ascii().setBorder('│', '─', '✧', '✧');
      if (title) table.setTitle(title);
      if (heading) table.setHeading(heading);

      const maxRows = Math.max(...data.map((col) => col.length));
      for (let i = 0; i < maxRows; i++) {
        const rowData = data.map((col) => col[i]) || '';
        table.addRow(...rowData);
      }

      console.log(table.toString());
    };

    const slashList = ListByFilter(slashCommands);
    const subList = ListByFilter(subCommands, 'parent');
    const prefixList = ListByFilter(prefixCommands);
    const componentList = ListByFilter(envCollection, 'type');

    logAsciiTable([prefixList, componentList], {
      title: 'Load Prefix Commands & Components',
      heading: [commandTypes.Prefix.name + `[${prefixCommands.size}]`, 'Components' + ` [${envCollection.size}]`],
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
          return console.error(chalk.red(`Error while pushing SlashCommand toJSON [ 'slashArray' ] data\n`), e);
        }

        try {
          if (slashArray.length > 0) {
            const rest = new REST({ version: 10 }).setToken(token);
            let data = [];

            // Đăng ký Guild Commands cho bot phụ chỉ trên guildId cụ thể
            if (clientId === '995949416273940623')
              data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashArray });
            // Đăng ký Global Commands cho bot chính
            else data = await rest.put(Routes.applicationCommands(clientId), { body: slashArray });

            console.log(chalk.green(`\n🔃 Reloaded ${data.length} application (/) commands\n`));
          } else
            console.log(
              chalk.yellow(
                `[Warn] Cannot load application (/) commands to Discord API: ${chalk.red(
                  `No data in [ 'slashArray' ]`,
                )}`,
              ),
            );
        } catch (e) {
          return console.error(chalk.yellow('Error while realoading application (/) commands to Discord API\n'), e);
        }
      })().catch(console.error);
    }
  };
};
