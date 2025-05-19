const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('youtube')
    .setDescription(`Setup Youtube. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('notify')
        .setDescription(`Set notify channel for Youtube. ${cfg.adminRole} only`)
        .addChannelOption((opt) =>
          opt.setName('notify-channel').setDescription('Choose channel to notify').setRequired(true),
        ),
    )
    .addSubcommand((sub) => sub.setName('refresh').setDescription(`Refresh Youtube notify ${cfg.adminRole} only`))
    .addSubcommand((sub) =>
      sub.setName('list-channels').setDescription(`List Youtube channels has been register ${cfg.adminRole} only`),
    )
    .addSubcommand((sub) =>
      sub
        .setName('disable')
        .setDescription(`Disable new Youtube videos notify ${cfg.adminRole} only`)
        .addBooleanOption((opt) =>
          opt.setName('confirm').setDescription('Disable Youtube notify confirm').setRequired(true),
        ),
    ),
  category: 'setup',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {},
};
