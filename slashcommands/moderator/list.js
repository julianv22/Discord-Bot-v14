const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('list')
    .setDescription(`${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('members')
        .setDescription(`List members of a role. ${cfg.modRole} only`)
        .addRoleOption((opt) =>
          opt.setName('role').setDescription('Select the role you want to list').setRequired(true),
        )
        .addBooleanOption((opt) => opt.setName('mention').setDescription('Mentions?').setRequired(true))
        .addStringOption((opt) => opt.setName('description').setDescription('Description Config'))
        .addBooleanOption((opt) => opt.setName('inline').setDescription('Inline')),
    ),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * List members of a role
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {},
};
