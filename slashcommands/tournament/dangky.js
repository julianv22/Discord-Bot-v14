const { SlashCommandBuilder, ChatInputCommandInteraction, Client, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName('dangky')
    .setDescription('Register Tournament!')
    .addStringOption((option) => option.setName('ingame').setDescription('ingame').setRequired(true)),
  /** - Đăng ký giải đấu
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;
    const { errorEmbed, catchError } = client;
    const stIngame = options.getString('ingame');
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    const register = profile.tournament.status;

    if (!register)
      return await interaction.reply(errorEmbed({ desc: 'Hiện không có giải đấu nào diễn ra!', emoji: false }));

    const roleID = profile?.tournament?.id;
    const role = guild.roles.cache.get(roleID);

    try {
      if (role) {
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
            color: Colors.Green,
          })
        );

        await interaction.followUp(
          errorEmbed({ desc: `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`, emoji: true })
        );
        // Add Role
        const bot = guild.members.me || (await guild.members.fetch(client.user.id));
        if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
          if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return await interaction.followUp(
              errorEmbed({ desc: `Bot cần quyền \`Manage Roles\` để gán role ${role}!`, emoji: false })
            );
          }
          if (bot.roles.highest.position <= role.position) {
            return await interaction.followUp(
              errorEmbed({
                desc: `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`,
                emoji: false,
              })
            );
          }
        } else await guild.members.cache.get(user.id).roles.add(role);
      }
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
