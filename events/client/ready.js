const { Client } = require('discord.js');
const ascii = require('ascii-table');
const moment = require('moment-timezone');

module.exports = {
  name: 'ready',
  once: true,
  /**
   * Bot ready event
   * @param {Client} client - Client object
   */
  async execute(client) {
    try {
      const { setPresence, serverStats, checkVideos } = client;
      const seperator = ['─'.repeat(20), '─'.repeat(client.user.tag.length + 2)];
      const table = new ascii()
        .setBorder('│', '─', '✧', '✧')
        .setTitle('✅ Client Ready\u200b')
        .setAlignCenter(2)
        .setHeading('🦸 Author: Julian-V', 'ID: ' + cfg.ownerID)
        .addRow('🚀 Client Name', client.user.tag + '\u200b\u200b')
        .addRow(seperator)
        .addRow('🌐 Client ID', client.user.id)
        .addRow(seperator)
        .addRow(`🧮 Guilds: ${client.guilds.cache.size}`, `💬 Channels: ${client.channels.cache.size}`)
        .addRow(seperator)
        .addRow(`📝 Node JS: ${process.version}`, `💻 System: ${process.platform} ${process.arch}`)
        .addRow(seperator)
        .addRow(
          `💾 Memory: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          `📊 RSS: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        );

      console.log(table.toString(), chalk.bgYellow('\n---------------Project is started!---------------\n'));

      const guilds = client.guilds.cache.map((g) => g);
      console.log(
        chalk.magenta.bold('Working in ') +
          guilds.length +
          chalk.magenta.bold(` server${guilds.length > 1 ? 's' : ''}:`),
        guilds.reduce((servers, g) => {
          servers[g.name] = g.id;
          return servers;
        }, {}),
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

      for (const guild of guilds) {
        await serverStats(client, guild.id);
        setInterval(async () => {
          await serverStats(client, guild.id);
        }, 5 * 60 * 1000);
      }
    } catch (e) {
      console.error(chalk.red('Error while running event ready\n'), e);
    }
  },
};
