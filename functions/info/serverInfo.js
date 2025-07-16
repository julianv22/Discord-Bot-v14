const { Client, Interaction, Message, EmbedBuilder, ChannelType } = require('discord.js');
const moment = require('moment-timezone');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Get Server information
   * @param {Interaction|Message} object - Interaction or Message */
  client.serverInfo = async (object) => {
    const { catchError } = client;
    const author = object.user || object.author;
    const guild = object.guild;
    const channels = guild.channels.cache;
    const members = guild.members.cache;

    try {
      const bots = members.filter((m) => m.user.bot).size;
      const textChannels = channels.filter((c) => c.type === ChannelType.GuildText).size;
      const voicesChannels = channels.filter((c) => c.type === ChannelType.GuildVoice).size;
      const categories = channels.filter((c) => c.type === ChannelType.GuildCategory).size;
      const owner = await guild.fetchOwner();

      const embeds = [
        new EmbedBuilder()
          .setColor('Random')
          .setThumbnail(guild.iconURL(true))
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setTitle('⚠️ Server Info ⚠️')
          .setFooter({
            text: `Requested by ${author.displayName || author.username}`,
            iconURL: `${author.displayAvatarURL(true)}`,
          })
          .setTimestamp()
          .setFields(
            { name: '💎 Server Name:', value: `${guild.name}`, inline: true },
            { name: '🆔:', value: `||${guild.id}||`, inline: true },
            { name: '👑 Server Owner:', value: `${owner}` },
            {
              name: `📊 Members [${guild.memberCount.toLocaleString()}]:`,
              value: `${(guild.memberCount - bots).toLocaleString()} Members\n${bots} Bots`,
              inline: true,
            },
            {
              name: `📈 Channels [${textChannels + voicesChannels}]:`,
              value: `\`${categories} 📂 | ${textChannels} 💬 | ${voicesChannels} 🔊\``,
              inline: true,
            },
            {
              name: `📉 Roles [${guild.roles.cache.size}]:`,
              value: `Highest: ${guild.roles.highest}`,
              inline: true,
            },
            {
              name: '🚀 Total Boosts:',
              value: `${guild.premiumSubscriptionCount || 'None'}`,
              inline: true,
            },
            {
              name: '🌏 Server Region:',
              value: `${guild.preferredLocale}`,
              inline: true,
            },
            {
              name: '☑️ Verification Level:',
              value: `${guild.verificationLevel}`,
              inline: true,
            },
            {
              name: `📆 Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
              value: `${moment(guild.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
            }
          ),
      ];

      return await object.reply({ embeds });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('serverInfo')} function`);
    }
  };
};
