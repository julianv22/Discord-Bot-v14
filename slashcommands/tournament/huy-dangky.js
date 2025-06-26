const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setName('huy')
    .setDescription('Unregister Tournament!')
    .addSubcommand((sub) =>
      sub
        .setName('dangky')
        .setDescription('Huỷ đăng ký giải đấu')
        .addBooleanOption((option) =>
          option.setName('confirm').setDescription('Hãy chắc chắn trước khi đưa ra quyết định‼').setRequired(true)
        )
    ),
  /** - Huỷ đăng ký giải
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed } = client;

    // Verified
    if (!options.getBoolean('confirm'))
      return await interaction.reply(
        errorEmbed({
          desc: 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!',
          emoji: '❗',
          color: Colors.Orange,
        })
      );

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    const register = profile.tournament.status;

    if (!register)
      return await interaction.reply(
        errorEmbed({
          desc: 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!',
          emoji: '🏆',
          color: Colors.DarkVividPink,
        })
      );
    // Check Tournament's Status
    let tourProfile = await tournamentProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error);

    if (!tourProfile || !tourProfile?.status)
      return await interaction.reply(errorEmbed({ desc: `${user} chưa đăng ký giải đấu!` }));
    // Kiểm tra role giải đấu
    const role = guild.roles.cache.get(profile?.tournament?.id);
    if (!role)
      return await interaction.reply(errorEmbed({ desc: 'Giải đấu không tồn tại! Vui lòng liên hệ ban quản trị!' }));
    // Set Tournament's Status
    tourProfile.status = false;
    await tourProfile.save().catch(console.error);
    // Remove Role
    const bot = guild.members.me || (await guild.members.fetch(client.user.id));

    if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
      if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return await interaction.followUp(errorEmbed({ desc: `Bot cần quyền \`Manage Roles\` để gán role ${role}!` }));
      }
      if (bot.roles.highest.position <= role.position) {
        return await interaction.followUp(
          errorEmbed({
            desc: `Bot không thể gỡ role ${role} vì role này cao hơn hoặc bằng role của bot!`,
            emoji: false,
          })
        );
      }
    } else await guild.members.cache.get(user.id).roles.remove(role);

    await interaction.reply(
      errorEmbed({ desc: `${user} huỷ đăng ký giải ${role}!!`, emoji: '🏆', color: Colors.DarkGreen })
    );
  },
};
