const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('youtube')
    .setDescription(`Manages YouTube channel subscriptions and notifications. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub.setName('channel').setDescription(`Adds or removes a YouTube channel to follow. ${cfg.adminRole} only`)
    )
    .addSubcommand((sub) =>
      sub
        .setName('notify')
        .setDescription(`Sets the notification channel and alert role for YouTube updates. ${cfg.adminRole} only`)
    ),
  /** - Manages YouTube channel subscriptions and notifications
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
