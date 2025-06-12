const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('leaderboard')
    .setDescription(`Show leaderboards. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('level')
        .setDescription(`Show Level Leaderboard. ${cfg.adminRole} only`)
        .addIntegerOption((opt) => opt.setName('week').setDescription('Weak').setMinValue(1).setRequired(true))
        .addStringOption((opt) => opt.setName('image').setDescription('Image URL').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('thanks')
        .setDescription('Show Thanks Leaderboard. ' + `${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('time').setDescription('Time to calculate thanks')),
    )
    .addSubcommand((sub) =>
      sub.setName('economy').setDescription('Show Economy Leaderboard (top 💲, streak, max streak)'),
    ),
  /**
   * Show leaderboard
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {},
};
