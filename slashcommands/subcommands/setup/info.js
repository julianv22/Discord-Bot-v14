const {
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('info'),
  /** - Get setup information
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const { errorEmbed, channels } = client;

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

    if (!profile)
      return await interaction.reply(errorEmbed({ desc: 'Hiện chưa có setup nào cho server ' + guild.name }));

    const welcomeChannel = channels.cache.get(profile?.setup?.welcome?.channel) || '\\⚠️ `/setup welcome`';
    const welcomeMessage = profile?.setup?.welcome?.message || '\\⚠️ `/setup welcome`';
    const logChannel = channels.cache.get(profile?.setup?.welcome?.log) || '\\⚠️ Not set';
    const starboardChannel = channels.cache.get(profile?.setup?.starboard?.channel) || '\\⚠️ `/setup starboard`';
    const youtubeNotifyChannel = channels.cache.get(profile?.youtube?.notifyChannel) || '\\⚠️ `/youtube notify`';
    const ytChannels = profile?.youtube?.channels?.length;
    const alertRole = profile?.youtube.alert
      ? `${guild.roles.cache.get(profile.youtube.alert)}`
      : '\\⚠️ `/youtube alerts`';
    const suggestChannel = channels.cache.get(profile?.setup?.suggest) || '\\⚠️ `/setup suggest`';
    const tourName = profile?.tournament?.id ? `${guild.roles.cache.get(profile.tournament.id)}` : '\\⚠️ `/tournament`';
    const tourStatus = profile?.tournament?.status ? '`✅ Open`' : '`❌ Closed`';
    const starCount = profile?.setup?.starboard?.star;
    const serverStatus = profile?.statistics?.totalChannel ? '\\✅ Set' : '\\❌ Not set';

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkAqua)
      .setTitle(`Setup's Information`)
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setDescription('‼️ Thông tin các thiết lập trong server')
      .setThumbnail(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Information.svg/2048px-Information.svg.png'
      )
      .addFields({ name: 'Welcome Channel', value: `${welcomeChannel}`, inline: true })
      .addFields({ name: 'Welcome Message', value: `${welcomeMessage}`, inline: true })
      .addFields({ name: 'Log Channel', value: `${logChannel}`, inline: true })
      .addFields({ name: 'Starboard Channel', value: `${starboardChannel} (${starCount || '0'}\\⭐)`, inline: false })
      .addFields({ name: 'Suggest Channel', value: `${suggestChannel}`, inline: false })
      .addFields({
        name: `Youtube Notify (${ytChannels || 0}) \`/youtube list-channel\``,
        value: `${youtubeNotifyChannel} | Alert role: ${alertRole}`,
        inline: false,
      })
      .addFields({ name: `Server's Status Channel`, value: serverStatus + '  `/server-stats`', inline: false })
      .addFields({ name: 'Tournament', value: `${tourName}`, inline: true })
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    if (tourStatus) embed.addFields({ name: 'Tournament Status', value: tourStatus, inline: true });

    return await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
