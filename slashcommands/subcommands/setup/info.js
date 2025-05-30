const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, EmbedBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('info'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  /**
   * Get setup information
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed, channels } = client;
    const { guild, user, guildId } = interaction;
    try {
      let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});

      if (!profile)
        return await interaction.reply(errorEmbed({ description: 'Hiện chưa có setup nào cho server', emoji: false }));

      const welcomeChannel = channels.cache.get(profile?.setup?.welcome?.channel);
      const logChannel = channels.cache.get(profile?.setup?.welcome?.log);
      const starboardChannel = channels.cache.get(profile?.setup?.starboard?.channel);
      const youtubeNotifyChannel = channels.cache.get(profile?.youtube?.notifyChannel);
      const ytChannels = profile?.youtube?.channels?.length;
      const suggestChannel = channels.cache.get(profile?.setup?.suggest);
      const welcomeMessage = profile?.setup?.welcome?.message;
      const tourName = profile?.tournament?.id ? `${guild.roles.cache.get(profile.tournament.id)}` : 'None';
      const tourStatus = profile?.tournament?.status == true ? '\\✅ Open' : '\\❌ Closed';
      const starCount = profile?.setup?.starboard?.star;
      const serverStatus = profile?.statistics?.totalChannel ? '\\✅ Set' : '\\❌ Not set';

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
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

      if (profile?.tourName) embed.addFields({ name: 'Tournament status', value: tourStatus, inline: true });

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      console.error(chalk.red('Error (/setup info):', e));
      return await interaction.reply(
        errorEmbed({ title: `\❌ | Error when getting setup info`, description: e, color: 'Red' }),
      );
    }
  },
};
