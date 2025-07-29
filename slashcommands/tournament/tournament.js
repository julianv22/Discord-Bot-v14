const {
  Client,
  Interaction,
  SlashCommandBuilder,
  SeparatorBuilder,
  ContainerBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { sectionComponents, menuComponents, textDisplay, rowComponents } = require('../../functions/common/components');

module.exports = {
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('tournament')
    .setDescription(`🏆 Setup tournament.\n${cfg.adminRole} only`),
  /** - Setup giải đấu (open/close/list ds thành viên tham gia)
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { guild, guildId } = interaction;
    const { embedMessage } = client;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);

    if (!profile)
      return await interaction.editReply(
        embedMessage({ desc: 'Không tìm thấy cấu hình máy chủ. Vui lòng thiết lập lại bot.' })
      );

    const { tournament } = profile || {};
    const getRole = (roleId) => guild.roles.cache.get(roleId) || '*\u274C\uFE0F Chưa có giải nào*';

    const open_close_buttons = [
      { customId: 'tournament:open', label: '✅ Mở đăng ký', style: ButtonStyle.Success },
      { customId: 'tournament:close', label: '❌ Đóng đăng ký', style: ButtonStyle.Secondary },
      { customId: 'tournament:close_all', label: '⛔ Đóng toàn bộ giải', style: ButtonStyle.Danger },
    ];
    const manage_buttons = [
      { customId: 'tournament:list', label: '📜 Danh sách thành viên tham gia', style: ButtonStyle.Primary },
      { customId: 'tournament:to_excel', label: '📑 Xuất DS ra Excel', style: ButtonStyle.Primary },
    ];

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \\🏆 Tournament Infomation',
            `- Tournament name: ${getRole(tournament?.roleId)}`,
            `- Status: ${tournament?.isActive ? '\u2705\uFE0F Open' : '*\u274C\uFE0F Closed*'}`,
          ],
          ComponentType.Thumbnail,
          cfg.tournament_gif
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay(['### \\⚙️ Setup tournament', '- Chọn tên giải đấu \\⤵️']))
      .addActionRowComponents(
        menuComponents('tournament-menu', '🏆 Select a tournament role', ComponentType.RoleSelect)
      )
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, open_close_buttons))
      )
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, manage_buttons))
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  },
};
