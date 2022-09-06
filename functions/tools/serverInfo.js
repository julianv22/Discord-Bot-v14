const { Client, GuildMember, Interaction, EmbedBuilder, ChannelType, Guild, Message } = require('discord.js');
const moment = require('moment-timezone');

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {Guild} guild
   * @param {GuildMember} author
   * @param {Interaction} interaction
   * @param {Message} message
   */
  client.serverInfo = async (guild, author, interaction, message) => {
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const channels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voices = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

    var embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Server Info')
      .setColor('Random')
      .setThumbnail(guild.iconURL(true))
      .setFooter({ text: `Requested by ${author.username}`, iconURL: `${author.displayAvatarURL(true)}` })
      .setTimestamp()
      .addFields([
        { name: 'Server Name:', value: `${guild.name}`, inline: true },
        { name: 'Server ID:', value: `||${guild.id}||`, inline: true },
        { name: 'Server Owner:', value: `<@${guild.ownerId}>` },
        {
          name: `Total Members [${guild.memberCount.toLocaleString()}]:`,
          value: `${(guild.memberCount - bots).toLocaleString()} Members\n${bots} Bots`,
          inline: true,
        },
        { name: 'Total Channels:', value: `${channels} Text\n${voices} Voice`, inline: true },
        { name: 'Total Roles:', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Total Boosts:', value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: 'Server Region:', value: `${guild.preferredLocale}`, inline: true },
        { name: 'Verification Level:', value: `${guild.verificationLevel}`, inline: true },
        {
          name: `Created: <t:${parseInt(guild.createdTimestamp / 1000)}:R>`,
          value: `${moment(guild.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm ddd, Do MMMM YYYY')}`,
        },
      ]);

    interaction ? interaction.reply({ embeds: [embed] }) : message.reply({ embeds: [embed] });
  };
};
