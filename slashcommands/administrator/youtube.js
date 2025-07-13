const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('youtube')
    .setDescription(`Manages YouTube channel subscriptions and notifications. (${cfg.adminRole} only)`)
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription(`Adds or removes a YouTube channel to follow. (${cfg.adminRole} only)`)
    )
    .addSubcommand((sub) =>
      sub
        .setName('notify')
        .setDescription(`Sets the notification channel and alert role for YouTube updates. (${cfg.adminRole} only)`)
    )
    .addSubcommand((sub) =>
      sub.setName('refresh').setDescription(`Manually refreshes YouTube notifications. (${cfg.adminRole} only)`)
    ),
  /** - Manages YouTube channel subscriptions and notifications
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { errorEmbed, checkVideos } = client;
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'refresh') {
      await checkVideos();
      return await interaction.reply(
        errorEmbed({ desc: 'Successfully refreshed YouTube notifications!', emoji: true })
      );
    }
  },
};
