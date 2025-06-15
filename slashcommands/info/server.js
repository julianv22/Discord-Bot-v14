const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription(`Get server's informations and setup server statistics (${cfg.adminRole} only)`)
    .addSubcommand((sub) => sub.setName('info').setDescription('Server info'))
    .addSubcommand((sub) =>
      sub
        .setName('statistics')
        .setDescription(`Setup server statistics. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('total-count-channel').setDescription('Total Count Channel').setRequired(true),
        )
        .addChannelOption((opt) =>
          opt.setName('member-count-channel').setDescription('Members Count Channel').setRequired(true),
        )
        .addChannelOption((opt) =>
          opt.setName('bot-count-channel').setDescription('Bots Count Channel').setRequired(true),
        )
        .addChannelOption((opt) =>
          opt.setName('presence-count-channel').setDescription('Presences Count Channel').setRequired(true),
        ),
    ),
  /**
   * Show bot or server or user's info
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { guild, member, options } = interaction;
    const { serverStats, serverInfo, errorEmbed, catchError } = client;
    const subCommand = options.getSubcommand();

    const showInfo = {
      info: async () => await serverInfo(interaction),
      statistics: async () => {
        if (!member.permissions.has(PermissionFlagsBits.Administrator))
          return await interaction.reply(errorEmbed({ desc: 'You dont have Administrator permissions', emoji: false }));

        const [totalChannel, memberChannel, botChannel, presenceChannel] = [
          options.getChannel('total-count-channel'),
          options.getChannel('member-count-channel'),
          options.getChannel('bot-count-channel'),
          options.getChannel('presence-count-channel'),
        ];

        try {
          let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

          if (!profile)
            profile = await serverProfile
              .create({ guildID: guild.id, guildName: guild.name, prefix: prefix })
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
              { name: 'Bots Count Channel:', value: `${botChannel}` },
              { name: 'Preseneces Count Channel:', value: `${presenceChannel}` },
            );

          return await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (e) {
          return await catchError(interaction, e, { ...this, parent: 'server', data: { name: 'info' } });
        }
      },
    };

    if (!showInfo[subCommand]) throw new Error(`Invalid SubCommand ${chalk.green(subCommand)}`);

    await (showInfo[subCommand] || showInfo.default)();
  },
};
