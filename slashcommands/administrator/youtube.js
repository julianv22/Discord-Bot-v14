const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    .setName('youtube')
    .setDescription(`Manages YouTube channel subscriptions and notifications. (${cfg.adminRole} only)`)
    .addSubcommand((sub) =>
      sub
        .setName('channel')
        .setDescription(`Adds or removes a YouTube channel to follow. (${cfg.adminRole} only)`)
        .addStringOption((opt) => opt.setName('channel-id').setDescription('The YouTube channel ID.').setRequired(true))
        .addStringOption((opt) =>
          opt
            .setName('action')
            .setDescription('Choose to add or remove the channel.')
            .setRequired(true)
            .addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' })
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('notify')
        .setDescription(`Sets the notification channel for YouTube updates. (${cfg.adminRole} only)`)
        .addChannelOption((opt) =>
          opt
            .setName('notify-channel')
            .setDescription('The channel to send YouTube notifications to.')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('refresh').setDescription(`Manually refreshes YouTube notifications. (${cfg.adminRole} only)`)
    )
    .addSubcommand((sub) =>
      sub.setName('list-channels').setDescription(`Lists all registered YouTube channels. (${cfg.adminRole} only)`)
    )
    .addSubcommand(
      (sub) =>
        sub.setName('alerts').setDescription(`Sets the alert role for YouTube notifications. (${cfg.adminRole} only)`)
      // .addRoleOption((opt) => opt.setName('role').setDescription('Choice alert role, set empty for removing')),
    ),
  /** - Manages YouTube channel subscriptions and notifications
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed, checkVideos } = client;
    const { id: guildID, name: guildName } = guild;
    const subcommand = options.getSubcommand();

    if (subcommand === 'refresh') {
      await checkVideos();
      return await interaction.reply(
        errorEmbed({ desc: 'Successfully refreshed YouTube notifications!', emoji: true })
      );
    } else if (subcommand === 'alerts') {
      const profile = await serverProfile.findOne({ guildID });
      const { youtube } = profile;
      const role = guild.roles.cache.get(youtube.alert);

      const embed = new EmbedBuilder()
        .setAuthor({ name: guildName, iconURL: guild.iconURL(true) })
        .setTitle('YouTube New Video Alert Role:')
        .setDescription(role ? `Alert Role: ${role}` : 'No YouTube alert role has been set up yet.')
        .setColor(Colors.Orange)
        .setThumbnail(cfg.youtubePNG)
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('youtube-alert').setLabel('Set Role').setStyle(ButtonStyle.Primary)
          ),
        ],
        flags: 64,
      });
    }
  },
};
