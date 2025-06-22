const { Client, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, Colors } = require('discord.js');
const { reactionButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageRoles,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setName('reaction')
    .setDescription(`Create reaction role. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('role').setDescription('Reaction role')),
  /** - Execute the reaction-role command
   * @param {Client} client - The client instance
   * @param {ChatInputCommandInteraction} interaction - The Command Interaction */
  async execute(interaction, client) {
    const { guild } = interaction;

    await interaction.reply({
      embeds: [
        {
          author: { name: guild.name, iconURL: guild.iconURL(true) },
          title: '`💬Title`: Đặt tiêu đề cho reaction role',
          description:
            'Vui lòng tạo role trước khi thêm reaction role!\n\n`🎨Color`: Đặt màu sắc cho embed\n```fix\n' +
            Object.keys(Colors).join(', ') +
            '```\n`➕Add Role`: Thêm role vào reaction role',
          color: Math.floor(Math.random() * 0xffffff),
          timestamp: new Date(),
          footer: { text: 'Select your role ⤵️' },
        },
      ],
      components: [reactionButtons()],
      flags: 64,
    });
  },
};
