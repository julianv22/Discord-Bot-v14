const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  Colors,
} = require('discord.js');
const { reactionButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages],
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageMessages)
    .setName('reaction')
    .setDescription(`Create reaction role. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('role').setDescription('Reaction role')),
  /** - Execute the reaction-role command
   * @param {Client} client - The client instance
   * @param {ChatInputCommandInteraction} interaction - The Command Interaction */
  async execute(interaction, client) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('`💬Title`: Đặt tiêu đề cho reaction role')
      .setDescription(
        'Vui lòng tạo role trước khi thêm reaction role!\n\n`🎨Color`: Đặt màu sắc cho embed\n```fix\n' +
          Object.keys(Colors).join(', ') +
          '```\n`➕Add Role`: Thêm role vào reaction role'
      )
      .setColor('Random')
      .setTimestamp()
      .setFooter({ text: 'Select your role ⤵️' });

    await interaction.reply({ embeds: [embed], components: [reactionButtons()], flags: 64 });
  },
};
