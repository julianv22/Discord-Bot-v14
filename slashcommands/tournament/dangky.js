const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

const { SlashCommandBuilder, Interaction, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dang-ky')
    .setDescription('Register Tournament!')
    .addStringOption((option) => option.setName('ingame').setDescription('ingame').setRequired(true)),
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

    if (role) {
      // Add Tournament Profile
      let tourProfile = await tournamentProfile.findOne({
        guildID: guild.id,
        userID: user.id,
      });
      if (!tourProfile) {
        await tournamentProfile.create({
          guildID: guild.id,
          guildName: guild.name,
          userID: user.id,
          usertag: user.tag,
          ingame: stIngame,
          decklist: 'none',
          status: true,
        });
      } else {
        await tournamentProfile.findOneAndUpdate(
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
      const bot = guild.members.me || (await guild.members.fetch(client.user.id));
      if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
        if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
          await interaction.followUp(errorEmbed(true, `Bot cần quyền \`Manage Roles\` để gán role ${role}!`));
          return;
        }
        if (bot.roles.highest.position <= role.position) {
          await interaction.followUp(
            errorEmbed(true, `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`),
          );
          return;
        }
      } else {
        try {
          await guild.members.cache.get(user.id).roles.add(role);
          await interaction.followUp(errorEmbed(false, `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`));
        } catch (e) {
          console.error('Error while adding role to user:', e);
          return interaction.followUp(
            errorEmbed(true, `Bot không thể gán role ${role} cho bạn. Vui lòng liên hệ quản trị viên!\n${e}`),
          );
        }
      }
    }
  },
};
