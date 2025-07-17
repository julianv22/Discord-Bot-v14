const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('huy')
    .setDescription('🏆 Cancel tournament registration')
    .addSubcommand((sub) =>
      sub
        .setName('dang-ky')
        .setDescription('🏆 Huỷ đăng ký giải đấu')
        .addBooleanOption((option) =>
          option.setName('confirm').setDescription('✅ Xác nhận huỷ đăng ký giải đấu').setRequired(true)
        )
    ),
  /** - Huỷ đăng ký giải
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guildId,
      guild: { members, roles },
      user,
      options,
    } = interaction;
    const { errorEmbed } = client;
    const userId = user.id;

    // Verified
    if (!options.getBoolean('confirm'))
      return await interaction.reply(
        errorEmbed({ desc: 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!', emoji: '❗', color: Colors.Orange })
      );

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    if (!profile)
      return await interaction.reply(
        errorEmbed({ desc: 'Không tìm thấy cấu hình máy chủ. Vui lòng thiết lập lại bot.' })
      );

    const { tournament } = profile || {};

    if (!tournament?.isActive)
      return await interaction.reply(
        errorEmbed({
          desc: 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!',
          emoji: '🏆',
          color: Colors.Red,
        })
      );

    // Check Tournament's Status
    const tourProfile = await tournamentProfile.findOne({ guildId, userId }).catch(console.error);
    if (!tourProfile || !tourProfile?.registrationStatus)
      return await interaction.reply(errorEmbed({ desc: `${user} chưa đăng ký giải đấu!` }));

    // Kiểm tra role giải đấu
    if (!tournament?.roleId)
      return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy ID role giải đấu trong cấu hình máy chủ.' }));

    const role = roles.cache.get(tournament?.roleId);
    if (!role)
      return await interaction.reply(
        errorEmbed({
          desc: `Role giải đấu với ID \`${tournament?.roleId}\` không tồn tại! Vui lòng liên hệ ban quản trị!`,
        })
      );

    // Set Tournament's Status
    tourProfile.registrationStatus = false;
    await tourProfile.save().catch(console.error);

    if (tourProfile.registrationStatus)
      // Kiểm tra lại sau khi lưu
      return await interaction.reply(errorEmbed({ desc: 'Đã xảy ra lỗi khi hủy đăng ký giải đấu. Vui lòng thử lại.' }));

    // Remove Role
    const bot = members.me || (await members.fetch(client.user.id));

    if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles))
        return await interaction.followUp(errorEmbed({ desc: `Bot cần quyền \`Manage Roles\` để gỡ role ${role}!` }));

      if (bot.roles.highest.position <= role.position)
        return await interaction.followUp(
          errorEmbed({ desc: `Bot không thể gỡ role ${role} vì role này cao hơn hoặc bằng role của bot!` })
        );
    } else await members.cache.get(user.id).roles.remove(role).catch(console.error);

    await interaction.reply(
      errorEmbed({ desc: `${user} huỷ đăng ký giải ${role}!!`, emoji: '🏆', color: Colors.Orange })
    );
  },
};
