const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = client => {
  /** @param {Client} client @param {String} guildID */
  client.serverStats = async (client, guildID) => {
    try {
      // Start Server Stats
      const guild = client.guilds.cache.get(guildID);

      let profile = await serverProfile.findOne({
        guildID: guild.id,
      });
      if (!profile) {
        let createOne = await serverProfile.create({ guildID: guild.id, guildName: guild.name });
        createOne.save();
      }
      if (!profile?.totalChannel || !profile?.statsChannel) return;
      // Set Channel Name Function
      function setChannelName(id, name) {
        guild.channels.cache.get(id).setName(name);
      }

      const memberRole = await guild.roles.cache.get(profile?.memberRole);
      const memberCount = await memberRole.members.map(m => m.user).length.toLocaleString(); // -> count members by memberRole
      // await guild.members.cache.filter(m => !m.user.bot).size.toLocaleString(); // -> count members are not bot

      const botRole = await guild.roles.cache.get(profile?.botRole).name;
      const botCount = await guild.members.cache.filter(m => m.user.bot).size.toLocaleString();

      const statsChannels = [
        { id: profile?.totalChannel, name: `🌏 Total members: ${guild.memberCount.toLocaleString()}` },
        { id: profile?.membersChannel, name: `${memberRole.name}: ${memberCount}` },
        { id: profile?.botsChannel, name: `${botRole}: ${botCount}` },
      ];

      statsChannels.forEach(channel => {
        setChannelName(channel.id, channel.name);
      });
      // Set Status Channel Function
      function getPressence(stats) {
        return guild.members.cache.filter(m => m.presence?.status === stats).size.toLocaleString();
      }

      const stStatus =
        `🟢 ${getPressence('online')} ` + `🌙 ${getPressence('idle')} ` + `⛔ ${getPressence('dnd')} ` + `⚫ ${getPressence('offline')}`;

      setChannelName(profile?.statsChannel, stStatus);
      // End Server Stats
    } catch (e) {
      console.error(chalk.yellow.bold('[serverStats]'), e);
    }
  };
};
