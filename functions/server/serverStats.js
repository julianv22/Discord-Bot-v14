const { Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Sets up server statistics channels.
   * @param {string} guildId - The ID of the guild. */
  client.serverStats = async (guildId) => {
    const { logError, guilds } = client;

    try {
      // Start Server Stats
      const guild = guilds.cache.get(guildId);

      const profile = await serverProfile.findOne({ guildId }).catch(console.error);

      const { statistics } = profile || {};
      if (!profile || !statistics?.totalChannelId || !statistics?.presenceChannelId) return;

      /** - Gets the number of members with a given presence status.
       * @param {string} stats - The member presence status (e.g., 'online', 'idle'). */
      const getPressence = (stats) =>
        guild.members.cache.filter((m) => m.presence?.status === stats).size.toLocaleString();
      /** - Sets the name of a channel.
       * @param {string} id - The ID of the channel.
       * @param {string} name - The new name for the channel. */
      const setChannelName = async (id, name) => await guild.channels.cache.get(id).setName(name).catch(console.error);
      try {
        /*
        const memberRole = guild.roles.cache.get(statistics?.memberRole); // Gets the role of the member to be counted
        const memberCount = memberRole.members.map((m) => m.user).length.toLocaleString(); // Counts members by memberRole
        const botRole = guild.roles.cache.get(statistics?.botRole).name; // Gets the bot's role
        */
        const memberCount = guild.members.cache.filter((m) => !m.user.bot).size.toLocaleString(); // Counts members who are not bots in the server
        const botCount = guild.members.cache.filter((m) => m.user.bot).size.toLocaleString(); // Counts the number of bots in the server
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
