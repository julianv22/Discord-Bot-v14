const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('leaderboard')
    .setDescription(`Displays various leaderboards. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('level')
        .setDescription(`Displays the level leaderboard. ${cfg.adminRole} only`)
        .addIntegerOption((opt) =>
          opt.setName('week').setDescription('The week number for the leaderboard.').setMinValue(1).setRequired(true)
        )
        .addStringOption((opt) =>
          opt.setName('image').setDescription('The URL of the image to display.').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('thanks')
        .setDescription(`Displays the thanks leaderboard. ${cfg.adminRole} only`)
        .addStringOption((opt) => opt.setName('time').setDescription('The time period to calculate thanks for.'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('economy')
        .setDescription(`Displays the economy leaderboard (top balance, streak, max streak). ${cfg.adminRole} only`)
    ),
  /** - Displays various leaderboards (level/thanks/economy)
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
