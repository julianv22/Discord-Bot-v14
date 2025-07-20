const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { dashboardMenu } = require('../../functions/common/components');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Configures various server settings. ${cfg.adminRole} only`)
    .addSubcommand((opt) => opt.setName('dashboard').setDescription(`Setup dashboard. ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub.setName('info').setDescription(`Displays all current server setup information. ${cfg.adminRole} only`)
    ),
  /** - Configures various server settings
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user, options } = interaction;
    const { errorEmbed } = client;
    const guildName = guild.name;
    const subCommand = options.getSubcommand();

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.reply(errorEmbed({ desc: 'No data found for this server. Try again later!' }));

    /** @param {string} roleId  */
    const getRole = (roleId) => guild.roles.cache.get(roleId);
    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\n-# \\❌ Not set';

    switch (subCommand) {
      case 'dashboard':
        await interaction.reply({ components: [dashboardMenu()], flags: [32768, 64] });
        break;

      case 'info':
        const { welcome, starboard, youtube, tournament, statistics, suggest } = profile;
        const welcomeChannel = channelName(welcome?.channelId);
        const logChannel = channelName(welcome?.logChannelId);
        const welcomeMessage = welcome?.message || '\n-# \\❌ Not set';
        const starboardChannel = channelName(starboard?.channelId);
        const youtubeChannelCount = youtube?.channels?.length || 0;
        const youtubeNotifyChannel = channelName(youtube?.notifyChannelId);
        const youtubeAlertRole = getRole(youtube?.alertRoleId) || '\n-# \\❌ Not set';
        const suggestChannel = channelName(suggest.channelId);
        const tournamentName = getRole(tournament?.roleId) || '-# \\⚠️ /tournament';
        const tournamentStatus = tournament?.isActive ? '\\✅ Open' : '\\❌ Closed';
        const starboardStarCount = starboard?.starCount || 0;
        const statisticsChannel = statistics?.totalChannelId ? '\\✅ Set' : '\\❌ Not set';

        const embed = new EmbedBuilder()
          .setColor(Colors.DarkAqua)
          .setThumbnail(guild.iconURL(true))
          .setAuthor({ name: guildName, iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/26a0_fe0f/512.gif' })
          .setTitle(`Setup's Information`)
          .setFields(
            { name: 'Welcome Channel', value: `${welcomeChannel}`, inline: true },
            { name: 'Log Channel', value: `${logChannel}`, inline: true },
            { name: 'Welcome Message', value: `${welcomeMessage}`, inline: false },
            { name: 'Server Statistics', value: `${statisticsChannel}`, inline: false },
            { name: 'Starboard Channel', value: `${starboardChannel} (${starboardStarCount}\\⭐)`, inline: true },
            { name: 'Suggest Channel', value: `${suggestChannel}`, inline: true },
            {
              name: 'Youtube subscribed channels: ' + youtubeChannelCount,
              value: `\n-# \\⚠️ /youtube channel\n- Notify channel: ${youtubeNotifyChannel}\n- Alert role: ${youtubeAlertRole}\n-# \\⚠️ /youtube notify`,
              inline: false,
            },
            { name: 'Tournament', value: `${tournamentName}`, inline: true },
            { name: 'Tournament Status', value: tournamentStatus, inline: true },
            { name: '\u200b', value: '-# \\⚠️ **/setup dashboard** for more setting' }
          )
          .setFooter({
            text: `Requested by ${user.displayName || user.username}`,
            iconURL: user.displayAvatarURL(true),
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: 64 });
        break;
    }
  },
};
