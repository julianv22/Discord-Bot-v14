const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Server statistics
   * @param {Client} client - Client object
   * @param {String} guildID - Guild ID
   */
  client.serverStats = async (client, guildID) => {
    try {
      // Start Server Stats
      const guild = client.guilds.cache.get(guildID);
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
      if (!profile || !profile?.statistics?.totalChannel || !profile?.statistics?.presenceChannel) return;
      /**
       * Set channel name
       * @param {String} id - Channel ID
       * @param {String} name - Channel name
       */
      function setChannelName(id, name) {
        guild.channels.cache.get(id).setName(name);
      }

      const { statistics } = profile;
      const memberRole = guild.roles.cache.get(statistics?.memberRole);
      const memberCount = memberRole.members.map((m) => m.user).length.toLocaleString(); // -> count members by memberRole
      // await guild.members.cache.filter(m => !m.user.bot).size.toLocaleString(); // -> count members are not bot

      const botRole = guild.roles.cache.get(statistics?.botRole).name;
      const botCount = guild.members.cache.filter((m) => m.user.bot).size.toLocaleString();

      const statsChannels = [
        {
          id: statistics?.totalChannel,
          name: `🌏 Total members: ${guild.memberCount.toLocaleString()}`,
        },
        {
          id: statistics?.memberChannel,
          name: `${memberRole.name}: ${memberCount}`,
        },
        { id: statistics?.botChannel, name: `${botRole}: ${botCount}` },
      ];

      statsChannels.forEach((channel) => {
        setChannelName(channel.id, channel.name);
      });
      /**
       * Get the number of members with the given status
       * @param {String} stats - Member status
       * @returns {Number} - Number of members with the given status
       */
      function getPressence(stats) {
        return guild.members.cache.filter((m) => m.presence?.status === stats).size.toLocaleString();
      }

      const [icon, status] = [['🟢', '🌙', '⛔', '⚫'], []];
      let i = 0;
      ['online', 'idle', 'dnd', 'offline'].forEach((stats) => {
        status.push(`${icon[i++]} ${getPressence(stats)}`);
      });

      setChannelName(statistics?.presenceChannel, status.join(' '));
      // End Server Stats
    } catch (e) {
      console.error(chalk.red('Error while executing function serverStats'), e);
    }
  };
};
