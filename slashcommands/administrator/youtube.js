const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription(`Set up YouTube (Add/remove follow channels, notify channel). ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('setup')
        .setDescription(`Add or remove a YouTube channel. ${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('channel-id').setDescription('YouTube channel ID').setRequired(true))
        .addStringOption((opt) =>
          opt
            .setName('action')
            .setDescription('Add or remove channel')
            .setRequired(true)
            .addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' }),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName('notify')
        .setDescription(`Set the notification channel for YouTube. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('notify-channel').setDescription('Choose channel to notify').setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName('refresh').setDescription(`Refresh YouTube notifications. ${cfg.adminRole} only`),
    )
    .addSubcommand((sub) =>
      sub
        .setName('list-channels')
        .setDescription(`List YouTube channels that have been registered. ${cfg.adminRole} only`),
    )
    .addSubcommand(
      (sub) => sub.setName('alerts').setDescription(`Set alert role for Youtube notifications. ${cfg.adminRole} only`),
      // .addRoleOption((opt) => opt.setName('role').setDescription('Choice alert role, set empty for removing')),
    ),
  /** - Setup YouTube
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed, checkVideos } = client;
    const subcommand = options.getSubcommand();

    if (subcommand === 'refresh') {
      await checkVideos();
      return await interaction.reply(errorEmbed({ desc: 'Refesh successfully!', emoji: true }));
    } else if (subcommand === 'alerts') {
      let profile = await serverProfile.findOne({ guildID: guild.id });
      const { youtube } = profile;
      const role = guild.roles.cache.get(youtube.alert);

      await interaction.reply({
        embeds: [
          {
            author: { name: guild.name, iconURL: guild.iconURL(true) },
            title: 'Role thông báo khi Youtube có video mới:',
            description: role ? `Alert role: ${role}` : 'Chưa có YouTube alert role nào được thiết lập.',
            color: Colors.Orange,
            thumbnail: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/250px-YouTube_2024.svg.png',
            },
            timestamp: new Date(),
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('youtube-alert-btn').setLabel('Set Role').setStyle(ButtonStyle.Primary),
          ),
        ],
      });
    }
  },
};
