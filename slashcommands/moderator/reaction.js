const { Client, Interaction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const { reactionButtons } = require('../../functions/common/manage-embed');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages],
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageMessages)
    .setName('reaction')
    .setDescription(`Create a reaction role. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('role').setDescription(`Create a reaction role. ${cfg.modRole} only`)),
  /** - Execute the reaction-role command
   * @param {Client} client - The client instance
   * @param {Interaction} interaction - The Command Interaction */
  async execute(interaction, client) {
    const { guild } = interaction;

    const embeds = [
      new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setFooter({ text: 'Select your role ⤵️' })
        .setTimestamp()
        .setFields(
          { name: '\\💬 Title', value: 'Reaction role title.\n-# Vui lòng tạo role trước khi thêm reaction role.' },
          {
            name: '\\➕ Add Role',
            value: 'Add roles to the reaction role\n-# **Lưu ý:** Bạn có thể thêm nhiều role vào một reaction role.',
          },
          { name: '\\🎨 Color', value: '```fix\n' + Object.keys(Colors).join(', ') + '```' }
        ),
    ];

    await interaction.reply({ embeds, components: [reactionButtons()], flags: 64 });
  },
};
