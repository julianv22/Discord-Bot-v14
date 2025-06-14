const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Server statistics
   * @param {Client} client - Client object
   * @param {string} guildID - Guild ID
   */
  client.serverStats = async (client, guildID) => {
    try {
      // Start Server Stats
      const guild = client.guilds.cache.get(guildID);
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      if (!profile || !profile?.statistics?.totalChannel || !profile?.statistics?.presenceChannel) return;
      const { statistics } = profile;
      /**
       * Get the number of members with the given status
       * @param {string} stats - Member status
       * @returns {number} - Number of members with the given status
       */
      const getPressence = (stats) => {
        return guild.members.cache.filter((m) => m.presence?.status === stats).size.toLocaleString();
      };
      /**
       * Set channel name
       * @param {string} id - Channel ID
       * @param {string} name - Channel name
       */
      const setChannelName = async (id, name) => {
        await guild.channels.cache.get(id).setName(name).catch(console.error);
      };

      try {
        // const memberRole = guild.roles.cache.get(statistics?.memberRole); //Lấy role của member cần thống kê
        // const memberCount = memberRole.members.map((m) => m.user).length.toLocaleString(); // Thống kê số thành viên theo memberRole
        const memberCount = guild.members.cache.filter((m) => !m.user.bot).size.toLocaleString(); // Thống kê  số thành viên không phải là bot trong server
        // const botRole = guild.roles.cache.get(statistics?.botRole).name; // Lấy role của bot
        const botCount = guild.members.cache.filter((m) => m.user.bot).size.toLocaleString(); // Đếm số bot trong server

        const statsChannels = [
          { id: statistics?.totalChannel, name: `🌏 Total members: ${guild.memberCount.toLocaleString()}` },
          { id: statistics?.memberChannel, name: `🤵〔Members〕: ${memberCount}` },
          { id: statistics?.botChannel, name: `🎯〔Bots〕: ${botCount}` },
        ];

        for (const channel of statsChannels) setChannelName(channel.id, channel.name);
      } catch (e) {
        console.error(chalk.red(`Error while caching roles from server ${guild}\n`), e);
      }

      const [icon, status] = [['🟢', '🌙', '⛔', '⚫'], []];
      let i = 0;
      ['online', 'idle', 'dnd', 'offline'].forEach((stats) => status.push(`${icon[i++]} ${getPressence(stats)}`));

      setChannelName(statistics?.presenceChannel, status.join(' '));
      // End Server Stats
    } catch (e) {
      console.error(chalk.red('Error while executing serverStats function\n'), e);
    }
  };
};
