const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Setup server statistics command
   * @param {string} guildId - Guild ID */
  client.serverStats = async (guildId) => {
    const { logError, guilds } = client;

    try {
      // Start Server Stats
      const guild = guilds.cache.get(guildId);

      const profile = await serverProfile.findOne({ guildId }).catch(console.error);

      const { statistics } = profile || {};
      if (!profile || !statistics?.totalChannelId || !statistics?.presenceChannelId) return;

      /** - Get the number of members with the given status
       * @param {string} stats - Member status */
      const getPressence = (stats) => {
        return guild.members.cache.filter((m) => m.presence?.status === stats).size.toLocaleString();
      };
      /** - Set channel name
       * @param {string} id - Channel ID
       * @param {string} name - Channel name */
      const setChannelName = async (id, name) => {
        await guild.channels.cache.get(id).setName(name).catch(console.error);
      };

      try {
        /*
        const memberRole = guild.roles.cache.get(statistics?.memberRole); //Lấy role của member cần thống kê
        const memberCount = memberRole.members.map((m) => m.user).length.toLocaleString(); // Thống kê số thành viên theo memberRole
        const botRole = guild.roles.cache.get(statistics?.botRole).name; // Lấy role của bot
        */
        const memberCount = guild.members.cache.filter((m) => !m.user.bot).size.toLocaleString(); // Thống kê  số thành viên không phải là bot trong server
        const botCount = guild.members.cache.filter((m) => m.user.bot).size.toLocaleString(); // Đếm số bot trong server
        const statsChannels = [
          { id: statistics?.totalChannelId, name: `🌏 Total members: ${guild.memberCount.toLocaleString()}` },
          { id: statistics?.memberChannelId, name: `🤵〔Members〕: ${memberCount}` },
          { id: statistics?.botChannelId, name: `🎯〔Bots〕: ${botCount}` },
        ];

        for (const channel of statsChannels) setChannelName(channel.id, channel.name);
      } catch (e) {
        logError({ todo: 'updating server statistics channels for:', item: guild.name }, e);
      }

      const [icon, status] = [['🟢', '🌙', '⛔', '⚫'], []];
      let i = 0;
      ['online', 'idle', 'dnd', 'offline'].forEach((stats) => status.push(`${icon[i++]} ${getPressence(stats)}`));

      setChannelName(statistics?.presenceChannelId, status.join(' '));
      // End Server Stats
    } catch (e) {
      logError({ item: 'serverStats', desc: 'function' }, e);
    }
  };
};
