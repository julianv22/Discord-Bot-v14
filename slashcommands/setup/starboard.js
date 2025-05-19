const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('starboard')
    .setDescription(`Starboard System. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('disable')
        .setDescription(`Disable Starboard System. ${cfg.adminRole} only`)
        .addBooleanOption((opt) =>
          opt.setName('disable-confirm').setDescription('Disable Starboard System Confirm').setRequired(true),
        ),
    ),
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
