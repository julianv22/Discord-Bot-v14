const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('info'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,

  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed, channels } = client;
    const { guild, user, guildId } = interaction;
    try {
      let profile = await serverProfile.findOne({ guildID: guildId });

      if (!profile) return interaction.reply(errorEmbed(true, 'Hiện chưa có setup nào cho server'));

      const welcomeChannel = await channels.cache.get(profile?.welcomeChannel);
      const logChannel = await channels.cache.get(profile?.logChannel);
      const starboardChannel = channels.cache.get(profile?.starboardChannel);
      const youtubeNotifyChannel = channels.cache.get(profile?.youtubeNotifyChannel);
      const ytChannels = profile?.youtubeChannelIds.length;
      const suggestChannel = channels.cache.get(profile?.suggestChannel);
      const welcomeMessage = profile?.welcomeMessage;
      const tourName = profile?.tourID ? `${guild.roles.cache.get(profile.tourID)}` : 'None';
      const tourStatus = profile?.tourStatus == true ? '\\✅ Open' : '\\❌ Closed';
      const starCount = profile?.starCount;
      const serverStatus = profile?.totalChannel ? '\\✅ Set' : '\\❌ Not set';

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Setup's Information`)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setDescription('‼️ Thông tin các thiết lập trong server')
        .setThumbnail(
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Information.svg/2048px-Information.svg.png',
        )
        .addFields({
          name: 'Welcome channel',
          value: `${welcomeChannel || '\\⚠️ `/setup welcome`'}`,
          inline: true,
        })
        .addFields({
          name: 'Welcome message',
          value: `${welcomeMessage || '\\⚠️ `/setup welcome`'}`,
          inline: true,
        })
        .addFields({ name: 'Log channel', value: `${logChannel || '\\⚠️ Not set'}`, inline: true })
        .addFields({
          name: 'Starboard channel',
          value: `${starboardChannel || '\\⚠️ `/setup starboard`'} (${starCount || '0'}\\⭐)`,
          inline: false,
        })
        .addFields({
          name: 'Suggest channel',
          value: `${suggestChannel || '\\⚠️ `/setup suggest`'}`,
          inline: false,
        })
        .addFields({
          name: 'Youtube channel',
          value: `${youtubeNotifyChannel || '\\⚠️ `/youtube notify`'} (${ytChannels || 0} channels)`,
          inline: false,
        })
        .addFields({
          name: `Server's Status Channel`,
          value: serverStatus + `  \`/server-stats\``,
          inline: false,
        })
        .addFields({ name: 'Tournament', value: tourName, inline: true })
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName}`, iconURL: user.displayAvatarURL(true) });

      if (profile?.tourName) embed.addFields({ name: 'Tournament status', value: tourStatus, inline: true });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/setup info):', e));
      return interaction.reply(errorEmbed(true, 'Lỗi khi lấy thông tin setup info', e));
    }
  },
};
