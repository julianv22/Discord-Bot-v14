const { Client } = require('discord.js');
const ascii = require('ascii-table');

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
      const seperator = ['─'.repeat(19), '─'.repeat(client.user.tag.length + 2)];
      const table = new ascii()
        .setBorder('│', '─', '✧', '✧')
        .setTitle('✅ Client Ready\u200b')
        .setAlignCenter(2)
        .setHeading('🦸 Author: Julian-V', `📝 Node JS: ${process.version}`)
        .addRow('🚀 Client Name', client.user.tag + '\u200b\u200b')
        .addRow(seperator)
        .addRow('🌐 Client ID', client.user.id);

      console.log(table.toString(), chalk.bgYellow('\n---------------Project is started!---------------\n'));

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

      // Server Stats
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
