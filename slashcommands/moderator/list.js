const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('list')
    .setDescription(`List members. ${cfg.modRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('members')
        .setDescription(`List members of a role. ${cfg.modRole} only`)
        .addRoleOption((opt) => opt.setName('role').setDescription('Select the role to list').setRequired(true))
        .addBooleanOption((opt) =>
          opt.setName('mention').setDescription('Whether to mention members').setRequired(true)
        )
        .addStringOption((opt) => opt.setName('title').setDescription('Title for the list'))
        .addBooleanOption((opt) => opt.setName('inline').setDescription('Whether to display members inline'))
    ),
  /** - List members of a role
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
