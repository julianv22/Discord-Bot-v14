const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
        .addRoleOption((opt) =>
          opt.setName('role').setDescription('Select the role you want to list').setRequired(true)
        )
        .addBooleanOption((opt) => opt.setName('mention').setDescription('Mentionable').setRequired(true))
        .addStringOption((opt) => opt.setName('title').setDescription('List title'))
        .addBooleanOption((opt) => opt.setName('inline').setDescription('Inline'))
    ),
  /** - List members of a role
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {},
};
