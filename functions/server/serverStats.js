const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
module.exports = (client) => {
  /**
   * Thống kê thông tin server
   * @param {Client} client - Đối tượng client
   * @param {String} guildID - ID của server
   */
  client.serverStats = async (client, guildID) => {
    try {
      // Start Server Stats
      const guild = client.guilds.cache.get(guildID);

      let profile =
        (await serverProfile.findOne({ guildID: guild.id }).catch(() => {})) ||
        new serverProfile({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix }).catch(() => {});

      if (!profile?.totalChannel || !profile?.statsChannel) return;
      /**
       * Đặt tên cho channel
       * @param {String} id - ID của channel
       * @param {String} name - Tên của channel
       */
      function setChannelName(id, name) {
        guild.channels.cache.get(id).setName(name);
      }

      const memberRole = await guild.roles.cache.get(profile?.memberRole);
      const memberCount = await memberRole.members.map((m) => m.user).length.toLocaleString(); // -> count members by memberRole
      // await guild.members.cache.filter(m => !m.user.bot).size.toLocaleString(); // -> count members are not bot

      const botRole = await guild.roles.cache.get(profile?.botRole).name;
      const botCount = await guild.members.cache.filter((m) => m.user.bot).size.toLocaleString();

      const statsChannels = [
        {
          id: profile?.totalChannel,
          name: `🌏 Total members: ${guild.memberCount.toLocaleString()}`,
        },
        {
          id: profile?.membersChannel,
          name: `${memberRole.name}: ${memberCount}`,
        },
        { id: profile?.botsChannel, name: `${botRole}: ${botCount}` },
      ];

      statsChannels.forEach((channel) => {
        setChannelName(channel.id, channel.name);
      });
      /**
       * Lấy số lượng member có trạng thái đó
       * @param {String} stats - Trạng thái của member
       * @returns {Number} - Số lượng member có trạng thái đó
       */
      function getPressence(stats) {
        return guild.members.cache.filter((m) => m.presence?.status === stats).size.toLocaleString();
      }

      const [icon, status] = [['🟢', '🌙', '⛔', '⚫'], []];
      let i = 0;
      ['online', 'idle', 'dnd', 'offline'].forEach((stats) => {
        status.push(`${icon[i++]} ${getPressence(stats)}`);
      });

      setChannelName(profile?.statsChannel, status.join(' '));
      // End Server Stats
    } catch (e) {
      console.error(chalk.red('Error while running serverStats'), e);
    }
  };
};
