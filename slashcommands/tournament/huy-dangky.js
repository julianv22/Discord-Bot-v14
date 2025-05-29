const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('huy-dang-ky')
    .setDescription('Unregister Tournament!')
    .addBooleanOption((option) =>
      option.setName('confirm').setDescription('Hãy chắc chắn trước khi đưa ra quyết định‼').setRequired(true),
    ),
  category: 'tournament',
  scooldown: 0,
  /**
   * Unregister for a tournament
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    // Verified
    if (options.getBoolean('confirm') === false)
      return await interaction.reply(errorEmbed('❗ ', 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!'));

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
    let register = !profile || !profile?.tournament?.status ? false : profile.tournament.status;

    try {
      if (register === false)
        return await interaction.reply(
          errorEmbed(`\\🏆 | `, 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!'),
        );
      // Check Tournament's Status
      let tourProfile = await tournamentProfile
        .findOne({
          guildID: guild.id,
          userID: user.id,
        })
        .catch(() => {});

      if (!tourProfile || !tourProfile?.status)
        return await interaction.reply(errorEmbed(true, `${user} chưa đăng ký giải đấu!`));

      const role = guild.roles.cache.get(profile?.tournament?.id);
      if (!role)
        return await interaction.reply(errorEmbed(true, `Giải đấu không tồn tại! Vui lòng liên hệ ban quản trị!`));

      // Set Tournament's Status
      await tournamentProfile
        .findOneAndUpdate({ guildID: guild.id, userID: user.id }, { status: false })
        .catch(() => {});

      // Remove Role
      const bot = guild.members.me || (await guild.members.fetch(client.user.id));

      if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
        if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
          return await interaction.followUp(errorEmbed(true, `Bot cần quyền \`Manage Roles\` để gán role ${role}!`));
        }
        if (bot.roles.highest.position <= role.position) {
          return await interaction.followUp(
            errorEmbed(true, `Bot không thể gỡ role ${role} vì role này cao hơn hoặc bằng role của bot!`),
          );
        }
      } else await guild.members.cache.get(user.id).roles.remove(role);

      await interaction.reply({
        embeds: [
          {
            color: 16711680,
            description: `\\🏆 | ${user} huỷ đăng ký giải ${role}!!`,
          },
        ],
      });
    } catch (e) {
      console.error(chalk.red('Error while running command (/huy-dang-ky):', e));
      return await interaction.reply(errorEmbed(true, 'Error while running command (/huy-dang-ky):', e));
    }
  },
};
