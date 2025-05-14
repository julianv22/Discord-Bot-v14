const serverProfile = require('../../config/serverProfile');
const tournamenProfile = require('../../config/tournamenProfile');

const { SlashCommandBuilder, Interaction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dang-ky')
    .setDescription('Đăng ký đấu giải!')
    .addStringOption((option) => option.setName('ingame').setDescription('Tên ingame').setRequired(true)),
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
    if (register === false) return interaction.reply(errorEmbed(true, 'Hiện không có giải đấu nào diễn ra!'));

    // Interaction Reply
    const roleID = profile?.tourID;
    const stIngame = options.getString('ingame');
    const role = guild.roles.cache.get(roleID);

    await interaction.reply(errorEmbed(`\\🏆 | `, `${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**`));

    await interaction.followUp(errorEmbed(false, `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`));

    if (role) {
      // Add Tournament Profile
      let tourProfile = await tournamenProfile.findOne({
        guildID: guild.id,
        userID: user.id,
      });
      if (!tourProfile) {
        let createOne = await tournamenProfile.create({
          guildID: guild.id,
          guildName: guild.name,
          userID: user.id,
          usertag: user.tag,
          ingame: stIngame,
          decklist: 'none',
          status: true,
        });
        createOne.save();
      } else {
        await tournamenProfile.findOneAndUpdate(
          { guildID: guild.id, userID: user.id },
          {
            guildName: guild.name,
            usertag: user.tag,
            ingame: stIngame,
            decklist: 'none',
            status: true,
          },
        );
      }

      // Add Role
      const botMember = guild.members.me || (await guild.members.fetch(client.user.id));
      if (!botMember.permissions.has('ManageRoles')) {
        await interaction.followUp(errorEmbed(true, 'Bot cần quyền Manage Roles để gán vai trò!'));
        return;
      }
      if (botMember.roles.highest.position <= role.position) {
        await interaction.followUp(
          errorEmbed(true, 'Bot không thể gán role này vì role đó cao hơn hoặc bằng role của bot!'),
        );
        return;
      }
      await guild.members.cache
        .get(user.id)
        .roles.add(role)
        .catch((e) => {
          interaction.followUp(errorEmbed(true, 'Bot không thể gán role cho bạn. Vui lòng liên hệ quản trị viên!', e));
          console.error(e);
        });
    }
  },
};
