const { Client } = require('discord.js');
const os = require('os');
const pkg = require('../../package.json');

module.exports = {
  name: 'ready',
  once: true,
  /** - Bot ready event
   * @param {Client} client - Discord Client */
  async execute(client) {
    const { setPresence, serverStats, checkVideos, logError, user, guilds, channels } = client;
    const servers = guilds.cache.map((g) => g);
    /** - Print console log with chalk options
     * @param {string} message Message content
     * @param {string} [color = 'reset'] Chalk color */
    const log = (message, color = 'reset') => console.log(chalk[color](message));

    /** - Options Configuration
     * @typedef {object} OptionsConfig
     * @property {string|string[]} name - Name column
     * @property {string|string[]} value - Value column
     * @property {string} [nameColor = 'blueBright'] - Color of name column
     * @property {string} [valueColor = 'cyan'] - Color of value column
     * @property {number} [tab = 1] - Separator tab */
    /** - Print table console log with chalk options
     * @param {OptionsConfig} options - Table options */
    const table = (options) => {
      let { name, value, nameColor = 'blueBright', valueColor = 'cyan', tab = 1 } = options;

      if (!name || !value) return;

      name = [].concat(name);
      value = [].concat(value);
      const contents = [];

      const loop = Math.min(name.length, value.length);
      for (let i = 0; i < loop; i++) {
        contents.push(chalk[nameColor](name[i]) + ' : ' + chalk[valueColor](value[i]));
      }

      console.log(contents.join(tab > 0 ? '\t'.repeat(tab) : ' '));
    };

    try {
      log(`\n${'-'.repeat(12)}[ Server Statistics ]${'-'.repeat(12)}\n`, 'red');
      table({ name: ['🦸 Author', '🆔'], value: [pkg.author, cfg.ownerID] });
      table({ name: '🚀 Client name', value: user.tag });
      table({ name: '🌐 Client Id', value: user.id });
      table({
        name: ['💫 Members', '💬 Channels'],
        value: [servers.reduce((total, server) => total + server.memberCount, 0), channels.cache.size],
        valueColor: 'yellow',
        tab: 2,
      });
      table({
        name: ['📝 Node JS', '📦 Packages'],
        value: [process.version, Object.keys(pkg.dependencies).length],
        valueColor: 'yellow',
      });
      table({
        name: ['💻 System', '💾 Memory'],
        value: [`${process.platform} ${process.arch}`, (process.memoryUsage().rss / 1024 / 1024).toFixed(1) + ' MB'],
      });
      table({ name: '⚛️ Core', value: os.cpus()[0].model });
      table({
        name: ['🟢 Heap Used', '🟡 Total'],
        value: [
          (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' MB',
          (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1) + ' MB',
        ],
      });
      table({ name: '📆 Last update:', value: '23:30, 27/07/2025' });
      log(`\n${'-'.repeat(12)}[ ✅ Client is ready ]${'-'.repeat(12)}`, 'green');

      console.log(
        chalk.magenta.bold('Working in'),
        servers.length,
        chalk.magenta.bold(`server${servers.length > 1 ? 's' : ''}:`),
        servers.reduce((servers, g) => {
          servers[g.name] = g.id;
          return servers;
        }, {})
        // guilds.map((g) => ({ [g.name]: g.id })),
      );

      // Lastest youtube videos
      await checkVideos();
      setInterval(async () => await checkVideos(), 30 * 60 * 1000);

      // Set Client's Pressence
      setPresence();
      setInterval(async () => await setPresence(), 15 * 60 * 1000);

      for (const server of servers) {
        await serverStats(server.id);
        setInterval(async () => await serverStats(server.id), 5 * 60 * 1000);
      }
    } catch (e) {
      logError({ todo: 'running', item: 'ready', desc: `event from ${chalk.green('client events')}` }, e);
    }
  },
};
