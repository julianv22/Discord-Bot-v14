const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('youtube')
    .setDescription(`Set up YouTube. ${cfg.adminRole} only`)
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
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
