const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('list')
    .setDescription(`${cfg.modRole} only`)
    .addSubcommand(sub =>
      sub
        .setName('members')
        .setDescription('List members of a role. ' + `${cfg.modRole} only`)
        .addRoleOption(opt => opt.setName('role').setDescription('Selct role you wanna list').setRequired(true))
        .addBooleanOption(opt => opt.setName('mention').setDescription('Mentions?').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Description Config'))
        .addBooleanOption(opt => opt.setName('inline').setDescription('Inline'))
    )
    .addSubcommand(sub => sub.setName('slash-command').setDescription(`'Slash Commands (/) List`)),
  category: 'help',
  // permissions: PermissionFlagsBits.ManageMessages,
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {},
};
