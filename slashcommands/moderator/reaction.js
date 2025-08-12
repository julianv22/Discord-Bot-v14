const {
  Client,
  Interaction,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  category: 'moderator',
  scooldown: 0,
  permissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageMessages],
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageMessages)
    .setName('reaction')
    .setDescription(`Create a reaction role. ${cfg.modRole} only`)
    .addSubcommand((sub) => sub.setName('role').setDescription(`Create a reaction role. ${cfg.modRole} only`)),
  /** Execute the reaction-role command
   * @param {Client} client The client instance
   * @param {Interaction} interaction The Command Interaction */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { guild } = interaction;

    const buttons = [
      { customId: 'reaction-role:hide', label: '⛔ Hide guide', style: ButtonStyle.Danger },
      { customId: 'reaction-role:title', label: '💬 Title', style: ButtonStyle.Primary },
      { customId: 'reaction-role:color', label: '🎨 Color', style: ButtonStyle.Secondary },
      { customId: 'reaction-role:add', label: '➕ Add Role', style: ButtonStyle.Success },
      { customId: 'reaction-role:finish', label: '✅ Finish', style: ButtonStyle.Success },
    ];

    const components = [new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons))];

    const embeds = [
      new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xffffff))
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

    await interaction.editReply({ embeds, components });
  },
};
