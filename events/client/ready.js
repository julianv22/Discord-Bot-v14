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
    const log = (message, color = 'reset') => console.log(chalk[color](message));
    const table = ({ name, value, nameColor = 'blueBright', valueColor = 'cyan', tab = 1 }) => {
      if (typeof name === 'string' && typeof value === 'string')
        return console.log(chalk[nameColor](name), ':', chalk[valueColor](value));

      if (Array.isArray(name) && Array.isArray(value)) {
        const loop = Math.min(name.length, value.length);
        const logs = [];
        for (let i = 0; i < loop; i++) {
          logs.push(chalk[nameColor](name[i]) + ' : ' + chalk[valueColor](value[i]));
        }
        return console.log(logs.join(tab > 0 ? '\t'.repeat(tab) : ' '));
      }

      return null;
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
        tab: 0,
      });
      table({ name: '📆 Last update:', value: '12:17 Thứ Hai, 23 tháng 6, 2025' });
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
      setInterval(() => {
        checkVideos();
      }, 30 * 60 * 1000);

      // Set Client's Pressence
      setPresence(client);
      setInterval(() => {
        setPresence(client);
      }, 5 * 60 * 1000);

      for (const server of servers) {
        await serverStats(client, server.id);
        setInterval(async () => {
          await serverStats(client, server.id);
        }, 5 * 60 * 1000);
      }
    } catch (e) {
      logError({ todo: 'running', item: 'ready', desc: `event from ${chalk.green('client events')}` }, e);
    }
  },
};
