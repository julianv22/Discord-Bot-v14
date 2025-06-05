const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { reactionButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageRoles,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setName('reaction-role')
    .setDescription(`Create reaction role. ${cfg.modRole} only`),
  /**
   * Execute the reaction-role command
   * @param {Client} client - The client instance
   * @param {Interaction} interaction - The interaction object
   */
  async execute(interaction, client) {
    const { guild } = interaction;

    const reactionEmbed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setColor('Random')
      .setTitle(`\`💬Title\`: Đặt tiêu đề cho reaction role`)
      .setDescription(
        `Vui lòng tạo role trước khi thêm reaction role!\n\n\`🎨Color\`: Đặt màu sắc cho embed\n\`\`\`fix\n${Object.keys(
          Colors,
        ).join(', ')}\`\`\`\n\`🟢Add Role\`: Thêm role vào reaction role`,
      )
      .setTimestamp()
      .setFooter({ text: 'Select your role ⤵️' });

    await interaction.reply({ embeds: [reactionEmbed], components: [reactionButtons()], flags: 64 });
  },
};
