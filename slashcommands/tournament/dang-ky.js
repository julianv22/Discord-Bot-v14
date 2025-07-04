const { Client, ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
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
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;
    const stIngame = options.getString('ingame');

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);

    if (!profile) {
      return await interaction.reply(
        errorEmbed({ desc: 'Không tìm thấy cấu hình máy chủ. Vui lòng thiết lập lại bot.' })
      );
    }

    const register = profile.tournament.status;

    if (!register) {
      return await interaction.reply(errorEmbed({ desc: 'Hiện không có giải đấu nào diễn ra!' }));
    }

    const roleID = profile?.tournament?.id;
    if (!roleID) {
      return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy ID role giải đấu trong cấu hình máy chủ.' }));
    }

    const role = guild.roles.cache.get(roleID);

    if (!role) {
      return await interaction.reply(
        errorEmbed({ desc: `Role giải đấu với ID \`${roleID}\` không tồn tại hoặc đã bị xóa.` })
      );
    }

    // Add Tournament Profile
    let tourProfile = await tournamentProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);

    if (!tourProfile) {
      tourProfile = await tournamentProfile
        .create({
          guildID: guild.id,
          guildName: guild.name,
          userID: user.id,
          usertag: user.tag,
          ingame: stIngame,
          decklist: '',
          status: true,
        })
        .catch(console.error);
    } else {
      tourProfile.guildName = guild.name;
      tourProfile.usertag = user.tag;
      tourProfile.ingame = stIngame;
      tourProfile.decklist = '';
      tourProfile.status = true;
      await tourProfile.save().catch(console.error);
    }

    await interaction.reply(
      errorEmbed({
        desc: `${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**`,
        emoji: '\\🏆',
        color: Colors.DarkGreen,
      })
    );

    await interaction.followUp(
      errorEmbed({ desc: `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`, emoji: true })
    );

    // Add Role
    const bot = guild.members.me || (await guild.members.fetch(client.user.id));
    if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await interaction.followUp(errorEmbed({ desc: `Bot cần quyền \`Manage Roles\` để gán role ${role}!` }));
      }
      if (bot.roles.highest.position <= role.position) {
        return await interaction.followUp(
          errorEmbed({
            desc: `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`,
            emoji: false,
          })
        );
      }
    } else {
      await guild.members.cache.get(user.id).roles.add(role).catch(console.error);
    }
  },
};
