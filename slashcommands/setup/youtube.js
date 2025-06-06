const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription(`Set up YouTube. ${cfg.adminRole} only`)
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
    ),
  /**
   * Setup YouTube
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const { errorEmbed, checkVideos } = client;
    const subcommand = options.getSubcommand();
    if (subcommand === 'refresh') {
      await checkVideos();
      return await interaction.reply(errorEmbed({ description: 'Refesh successfull!', emoji: true }));
    }
  },
};
