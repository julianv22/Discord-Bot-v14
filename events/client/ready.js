const ascii = require('ascii-table');
const { Client } = require('discord.js');
module.exports = {
  name: 'ready',
  once: true,
  /**
   * Bot ready event
   * @param {Client} client - Client object
   */
  async execute(client) {
    const { setPresence, serverStats, checkVideos } = client;
    const table = new ascii()
      .setBorder('│', '─', '✧', '✧')
      .setTitle('Client Login')
      .setAlignCenter(2)
      .addRow('Client Name', `${client.user.tag}\u200b\u200b`, '🚀')
      .addRow('────────────────', '────────────────────────', '──')
      .addRow('Client ID', client.user.id, '🌐')
      .addRow('────────────────', '────────────────────────', '──')
      .addRow(`Prefix: ${prefix}`, `Node JS: ${process.version}`, '📝')
      .addRow('────────────────', '────────────────────────', '──')
      .addRow(`Author: Julian-V`, 'Client Ready!', '✅\u200b');

    console.log(table.toString());
    console.log(chalk.bgYellow('\n-----------------Project is started!-----------------\n'));

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
      chalk.magenta.bold(`Working in ${guilds.length} server${guilds.length > 1 ? 's' : ''}:`),
      guilds.map((g) => g.name),
    );

    guilds.forEach((guild) => {
      serverStats(client, guild.id);
      setInterval(() => {
        serverStats(client, guild.id);
      }, 5 * 60 * 1000);
    });
  },
};
