const { Client, GuildMember, Interaction, EmbedBuilder, ChannelType, Guild, Message } = require('discord.js');
const moment = require('moment-timezone');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Server information
   * @param {Guild} guild - Guild object
   * @param {GuildMember} author - Author object
   * @param {Interaction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.serverInfo = async (guild, author, interaction, message) => {
    try {
      const bots = guild.members.cache.filter((m) => m.user.bot).size;
      const channels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
      const voices = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
      const categories = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
      const owner = await guild.fetchOwner();

      var embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('⚠️ Server Info ⚠️')
        .setColor('Random')
        .setThumbnail(guild.iconURL(true))
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: `${author.displayAvatarURL(true)}`,
        })
        .setTimestamp()
        .addFields([
          { name: '💎 Server Name:', value: `${guild.name}`, inline: true },
          { name: '🆔:', value: `||${guild.id}||`, inline: true },
          { name: '👑 Server Owner:', value: `${owner}` },
          {
            name: `📊 Members [${guild.memberCount.toLocaleString()}]:`,
            value: `${(guild.memberCount - bots).toLocaleString()} Members\n${bots} Bots`,
            inline: true,
          },
          {
            name: `📈 Channels [${channels + voices}]:`,
            value: `\`${categories} 📂 | ${channels} 💬 | ${voices} 🔊\``,
            inline: true,
          },
          {
            name: `📉 Roles [${guild.roles.cache.size}]:`,
            value: `Highest: ${guild.roles.highest}`,
            inline: true,
          },
          {
            name: '🚀 Total Boosts:',
            value: `${guild.premiumSubscriptionCount}`,
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
          },
        ]);

      (interaction ? interaction : message).reply({ embeds: [embed] });
    } catch (e) {
      const errorEmbed = {
        embeds: [{ color: 16711680, title: '❌ Error', description: `${e}` }],
      };
      if (interaction && typeof interaction.reply === 'function') {
        await interaction.reply({ ...errorEmbed, ephemeral: true }).catch(() => {});
      } else if (message && typeof message.reply === 'function') {
        message.reply(errorEmbed).catch(() => {});
      }
      console.error(chalk.red('Error while running serverInfo'), e);
    }
  };
};
