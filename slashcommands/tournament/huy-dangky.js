const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('huy-dang-ky')
    .setDescription('Unregister Tournament!')
    .addBooleanOption((option) =>
      option.setName('confirm').setDescription('Hãy chắc chắn trước khi đưa ra quyết định‼').setRequired(true),
    ),
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
      return await interaction.reply(
        errorEmbed({ description: 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!', emoji: `[\\❗] ` }),
      );

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    let register = !profile || !profile?.tournament?.status ? false : profile.tournament.status;

    try {
      if (register === false)
        return await interaction.reply(
          errorEmbed({
            description: 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!',
            emoji: `\\🏆 `,
            color: 'Red',
          }),
        );
      // Check Tournament's Status
      let tourProfile = await tournamentProfile
        .findOne({
          guildID: guild.id,
          userID: user.id,
        })
        .catch(console.error);

      if (!tourProfile || !tourProfile?.status)
        return await interaction.reply(errorEmbed({ description: `${user} chưa đăng ký giải đấu!`, emoji: false }));

      const role = guild.roles.cache.get(profile?.tournament?.id);
      if (!role)
        return await interaction.reply(
          errorEmbed({ description: 'Giải đấu không tồn tại! Vui lòng liên hệ ban quản trị!', emoji: false }),
        );

      // Set Tournament's Status
      await tournamentProfile
        .findOneAndUpdate({ guildID: guild.id, userID: user.id }, { status: false })
        .catch(console.error);

      // Remove Role
      const bot = guild.members.me || (await guild.members.fetch(client.user.id));

      if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
        if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
          return await interaction.followUp(
            errorEmbed({ description: `Bot cần quyền \`Manage Roles\` để gán role ${role}!`, emoji: false }),
          );
        }
        if (bot.roles.highest.position <= role.position) {
          return await interaction.followUp(
            errorEmbed({
              description: `Bot không thể gỡ role ${role} vì role này cao hơn hoặc bằng role của bot!`,
              emoji: false,
            }),
          );
        }
      } else await guild.members.cache.get(user.id).roles.remove(role);

      await interaction.reply(
        errorEmbed({ description: `${user} huỷ đăng ký giải ${role}!!`, emoji: `\\🏆 `, color: 'Green' }),
      );
    } catch (e) {
      console.error(chalk.red('Error while executing /huy-dang-ky command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while executing /huy-dang-ky command`, description: e, color: 'Red' }),
      );
    }
  },
};
