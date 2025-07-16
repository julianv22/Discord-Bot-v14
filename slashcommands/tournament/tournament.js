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
  ButtonBuilder,
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
    .setDescription(`🏆 Set up tournament.\n${cfg.adminRole} only`),
  /** - Setup giải đấu (open/close/list ds thành viên tham gia)
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, tournament: { id: '', name: '', status: false } })
        .catch(console.error);

    const { tournament } = profile || {};
    const getRole = (roleId) => guild.roles.cache.get(roleId) || '*\\❌ Chưa có giải nào*';

    const open_close_buttons = [
      { customId: 'tournament:open', label: '✅ Mở đăng ký', style: ButtonStyle.Success },
      { customId: 'tournament:close', label: '❌ Đóng đăng ký', style: ButtonStyle.Secondary },
      { customId: 'tournament:close_all', label: '⛔ Đóng toàn bộ giải', style: ButtonStyle.Danger },
    ];
    const manage_buttons = [
      { customId: 'tournament:list', label: '📜 Danh sách thành viên tham gia', style: ButtonStyle.Primary },
    ];

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \\🏆 Tournament Infomation',
            `- Tournament name: ${getRole(tournament?.id)}`,
            `- Status: ${tournament?.status ? '\\✅ Open' : '*\\❌ Closed*'}`,
          ],
          ComponentType.Thumbnail,
          guild.iconURL(true)
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay(['### \\⚙️ Setup tournament', '- Chọn tên giải đấu \\⤵️']))
      .addActionRowComponents(
        menuComponents('tournament-menu', '🏆 Select a tournament role', ComponentType.RoleSelect)
      )
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(open_close_buttons, ComponentType.Button))
      )
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(rowComponents(manage_buttons, ComponentType.Button))
      );

    await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [container],
    });
  },
};
