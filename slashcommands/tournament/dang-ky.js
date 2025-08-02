const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  category: 'tournament',
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName('dang-ky')
    .setDescription('🏆 Đăng ký giải đấu')
    .addStringOption((option) => option.setName('ingame').setDescription('Your in-game name').setRequired(true)),
  /** - Đăng ký giải đấu
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId, user, options } = interaction;
    const { name: guildName, members, roles } = guild;
    const { id: userId, displayName, username } = user;
    const userName = displayName || username;
    const stIngame = options.getString('ingame');

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);

    if (!profile)
      return await interaction.reply(
        embedMessage({ desc: 'Không tìm thấy cấu hình máy chủ. Vui lòng thiết lập lại bot.' })
      );

    const { tournament } = profile || {};

    if (!tournament?.isActive)
      return await interaction.reply(embedMessage({ desc: 'Hiện không có giải đấu nào diễn ra!' }));

    if (!tournament?.roleId)
      return await interaction.reply(embedMessage({ desc: 'Không tìm thấy ID role giải đấu trong cấu hình máy chủ.' }));

    const role = roles.cache.get(tournament?.roleId);

    if (!role)
      return await interaction.reply(
        embedMessage({ desc: `Role giải đấu với ID [${tournament?.roleId}] không tồn tại hoặc đã bị xóa.` })
      );

    // Add Tournament Profile
    const tourProfile = await tournamentProfile
      .findOneAndUpdate(
        { guildId, userId },
        { guildName, userName, inGameName: stIngame, registrationStatus: true },
        { upsert: true, new: true }
      )
      .catch(console.error);

    if (!tourProfile)
      return await interaction.reply(embedMessage({ desc: 'No data found for this server. Try again later!' }));

    await interaction.reply(
      embedMessage({
        title: 'Đăng ký giải đấu',
        desc: `${user} đăng ký giải ${role} --- 🎮 Tên ingame: **${stIngame}**`,
        emoji: cfg.tournament_gif,
        color: Colors.DarkGreen,
        flags: false,
      })
    );

    await interaction.followUp(
      embedMessage({ desc: `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`, emoji: '🏆' })
    );

    // Add Role
    const bot = members.me || (await members.fetch(client.user.id));
    if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles))
        return await interaction.followUp(
          embedMessage({
            title: 'Bot không có quyền gỡ role',
            desc: `Bot cần quyền Manage Roles để gán role ${role},!`,
          })
        );

      if (bot.roles.highest.position <= role.position)
        return await interaction.followUp(
          embedMessage({
            title: 'Bot không đủ quyền',
            desc: `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`,
          })
        );
    } else await members.cache.get(user.id).roles.add(role).catch(console.error);
  },
};
