const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const { SlashCommandBuilder, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('huy-dang-ky')
    .setDescription('Huỷ đăng ký đấu giải!')
    .addBooleanOption((option) =>
      option.setName('xacnhan').setDescription('HÃY CHẮC CHẮN VỚI ĐIỀU BẠN SẮP LÀM!').setRequired(true),
    ),
  category: 'tournament',
  cooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;

    let profile = await serverProfile.findOne({ guildID: guild.id });
    let register;
    if (!profile || !profile?.tourStatus) register = false;
    else register = profile.tourStatus;

    if (register === false)
      return interaction.reply(
        errorEmbed(`\\🏆 | `, 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!'),
      );

    // Verified
    if (options.getBoolean('xacnhan') === false)
      return interaction.reply(errorEmbed('❗ ', 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!'));

    // Check Tournament's Status
    let tourProfile = await tournamentProfile.findOne({
      guildID: guild.id,
      userID: user.id,
    });
    if (!tourProfile || !tourProfile?.status)
      return interaction.reply(errorEmbed(true, `${user} chưa đăng ký giải đấu!`));

    // Interaction Reply
    const role = guild.roles.cache.get(profile?.tourID);
    await interaction.reply(errorEmbed(`\\🏆 | `, `${user} huỷ đăng ký giải ${role}!!`));

    // Set Tournament's Status
    await tournamentProfile.findOneAndUpdate({ guildID: guild.id, userID: user.id }, { status: false });

    // Remove Role
    const botMember = guild.members.me || (await guild.members.fetch(client.user.id));
    if (!botMember.permissions.has('ManageRoles')) {
      await interaction.followUp(errorEmbed(true, 'Bot cần quyền Manage Roles để gán vai trò!'));
      return;
    }
    if (botMember.roles.highest.position <= role.position) {
      await interaction.followUp(
        errorEmbed(true, 'Bot không thể gỡ role này vì role đó cao hơn hoặc bằng role của bot!'),
      );
      return;
    }
    await guild.members.cache
      .get(user.id)
      .roles.remove(role)
      .catch((e) => {
        interaction.followUp(errorEmbed(true, 'Bot không thể gỡ role cho bạn. Vui lòng liên hệ quản trị viên!', e));
        console.error(e);
      });
  },
};
