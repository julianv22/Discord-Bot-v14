const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { dashboardMenu } = require('../../functions/common/components');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('setup')
    .setDescription(`Configures various server settings. (${cfg.adminRole} only)`)
    .addSubcommand((opt) => opt.setName('dashboard').setDescription('Setup dashboard. (${cfg.adminRole} only)'))
    .addSubcommand((sub) =>
      sub.setName('info').setDescription(`Displays all current server setup information. (${cfg.adminRole} only)`)
    ),
  /** - Configures various server settings
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId: guildID, user, options } = interaction;
    const { errorEmbed } = client;
    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case 'dashboard':
        await interaction.reply({
          flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
          components: [dashboardMenu()],
        });
        break;

      case 'info':
        const roles = guild.roles.cache;

        const profile = await serverProfile.findOne({ guildID }).catch(console.error);
        if (!profile) return await interaction.reply(errorEmbed({ desc: 'No setup data found for this server.' }));

        /** @param {string} channelId */
        const channelName = (channelId) => guild.channels.cache.get(channelId);

        const welcomeChannel = channelName(profile?.setup?.welcome?.channel) || '\n-# \\❌ Not set';
        const welcomeMessage = profile?.setup?.welcome?.message || '\n-# \\❌ Not set';
        const logChannel = channelName(profile?.setup?.welcome?.log) || '-# \\⚠️ Not set';
        const starboardChannel = channelName(profile?.setup?.starboard?.channel) || '-# \\⚠️ /setup starboard';
        const channelCount = profile?.youtube?.channels?.length || 0;
        const notifyChannel = channelName(profile?.youtube?.notifyChannel) || '\n-# \\❌ Not set';
        const alertRole = roles.get(profile?.youtube?.alert) || '\n-# \\❌ Not set';
        const suggestChannel = channelName(profile?.setup?.suggest) || '\n-# \\❌ Not set';
        const tourName = roles.get(profile?.tournament?.id) || '-# \\⚠️ /tournament';
        const tourStatus = profile?.tournament?.status ? '\\✅ Open' : '\\❌ Closed';
        const starCount = profile?.setup?.starboard?.star || 0;
        const serverStatus = profile?.statistics?.totalChannel ? '\\✅ Set' : '\\❌ Not set';

        const embed = new EmbedBuilder()
          .setColor(Colors.DarkAqua)
          .setThumbnail(cfg.infoPNG)
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setTitle(`Setup's Information`)
          .setFields(
            { name: 'Welcome Channel', value: `${welcomeChannel}`, inline: true },
            { name: 'Log Channel', value: `${logChannel}`, inline: true },
            { name: 'Welcome Message', value: `${welcomeMessage}`, inline: false },
            { name: 'Server Status Channel', value: `${serverStatus}`, inline: false },
            { name: 'Starboard Channel', value: `${starboardChannel} (${starCount}\\⭐)`, inline: true },
            { name: 'Suggest Channel', value: `${suggestChannel}`, inline: true },
            {
              name: 'Youtube subscribed channels: ' + channelCount,
              value: `\n-# \\⚠️ /youtube channel\n- Notify channel: ${notifyChannel}\n- Alert role: ${alertRole}\n-# \\⚠️ /youtube notify`,
              inline: false,
            },
            { name: 'Tournament', value: `${tourName}`, inline: true },
            { name: 'Tournament Status', value: tourStatus, inline: true },
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
