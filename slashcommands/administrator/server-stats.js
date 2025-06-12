const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('server-stats')
    .setDescription(`Setup Server statistics count. ${cfg.adminRole} only`)
    .addChannelOption((opt) =>
      opt.setName('total-count-channel').setDescription('Total Count Channel').setRequired(true),
    )
    .addChannelOption((opt) =>
      opt.setName('member-count-channel').setDescription('Members Count Channel').setRequired(true),
    )
    // .addRoleOption((opt) => opt.setName('member-role').setDescription('Member Role').setRequired(true))
    .addChannelOption((opt) => opt.setName('bot-count-channel').setDescription('Bots Count Channel').setRequired(true))
    // .addRoleOption((opt) => opt.setName('bot-role').setDescription('Bot Role').setRequired(true))
    .addChannelOption((opt) =>
      opt.setName('presence-count-channel').setDescription('Presences Count Channel').setRequired(true),
    ),
  /**
   * Setup server statistics
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { catchError, serverStats } = client;
    const totalChannel = options.getChannel('total-count-channel');
    const memberChannel = options.getChannel('member-count-channel');
    // const memberrole = options.getRole('member-role');
    const botChannel = options.getChannel('bot-count-channel');
    // const botrole = options.getRole('bot-role');
    const presenceChannel = options.getChannel('presence-count-channel');

    try {
      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

      if (!profile)
        profile = await serverProfile
          .create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix })
          .catch(console.error);

      const { statistics } = profile;

      if (!statistics) statistics = {};

      profile.guildName = guild.name;
      statistics.totalChannel = totalChannel.id;
      statistics.memberChannel = memberChannel.id;
      statistics.botChannel = botChannel.id;
      statistics.presenceChannel = presenceChannel.id;

      await profile.save().catch(console.error);

      serverStats(client, guild.id);

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('\\✅ Server stats set up successfully!')
        .setThumbnail('https://emoji.discadia.com/emojis/5dc63f16-97b4-402e-8d1f-a76e15fdd6ab.png')
        .setTimestamp()
        .addFields(
          { name: 'Total Count Channel:', value: `${totalChannel}` },
          { name: 'Members Count Channel:', value: `${memberChannel}` },
          // { name: 'Member Role:', value: `${memberrole}` },
          { name: 'Bots Count Channel:', value: `${botChannel}` },
          // { name: 'Bot Role:', value: `${botrole}` },
          { name: 'Preseneces Count Channel:', value: `${presenceChannel}` },
        );

      return await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
