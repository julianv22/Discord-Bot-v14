const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('leaderboard')
    .setDescription(`Show leaderboards. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('level')
        .setDescription(`Show level's leaderboard`)
        .addIntegerOption((opt) => opt.setName('week').setDescription('Tuần').setRequired(true))
        .addStringOption((opt) => opt.setName('image').setDescription('Image URL').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('thanks')
        .setDescription('Show thanks leaderboard')
        .addStringOption((opt) => opt.setName('time').setDescription('Time to thanks calculate')),
    ),
  category: 'moderator',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
