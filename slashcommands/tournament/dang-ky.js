const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

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
    const {
      guildId,
      guild: { name: guildName, members, roles },
      user,
      user: { id: userId, displayName, username },
      options,
    } = interaction;
    const { errorEmbed } = client;
    const userName = displayName || username;
    const stIngame = options.getString('ingame');

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);

    if (!profile)
      return await interaction.reply(
        errorEmbed({ desc: 'Không tìm thấy cấu hình máy chủ. Vui lòng thiết lập lại bot.' })
      );

    const { tournament } = profile || {};

    if (!tournament?.isActive)
      return await interaction.reply(errorEmbed({ desc: 'Hiện không có giải đấu nào diễn ra!' }));

    if (!tournament?.roleId)
      return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy ID role giải đấu trong cấu hình máy chủ.' }));

    const role = roles.cache.get(tournament?.roleId);

    if (!role)
      return await interaction.reply(
        errorEmbed({ desc: `Role giải đấu với ID \`${tournament?.roleId}\` không tồn tại hoặc đã bị xóa.` })
      );

    // Add Tournament Profile
    let tourProfile = await tournamentProfile.findOne({ guildId, userId }).catch(console.error);
    if (!tourProfile)
      tourProfile = await tournamentProfile
        .create({
          guildId,
          guildName,
          userId,
          userName,
          inGameName: stIngame,
          registrationStatus: true,
        })
        .catch(console.error);
    else {
      tourProfile.guildName = guildName;
      tourProfile.userName = userName;
      tourProfile.inGameName = stIngame;
      tourProfile.registrationStatus = true;
      await tourProfile.save().catch(console.error);
    }

    await interaction.reply(
      errorEmbed({
        desc: `${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**`,
        emoji: '🏆',
        color: Colors.DarkGreen,
        flags: false,
      })
    );

    await interaction.followUp(
      errorEmbed({ desc: `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`, emoji: true })
    );

    // Add Role
    const bot = members.me || (await members.fetch(client.user.id));
    if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles))
        return await interaction.followUp(errorEmbed({ desc: `Bot cần quyền \`Manage Roles\` để gán role ${role}!` }));

      if (bot.roles.highest.position <= role.position)
        return await interaction.followUp(
          errorEmbed({ desc: `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!` })
        );
    } else await members.cache.get(user.id).roles.add(role).catch(console.error);
  },
};
