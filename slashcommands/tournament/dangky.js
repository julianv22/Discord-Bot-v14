const { SlashCommandBuilder, Interaction, Client, PermissionFlagsBits, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName('dang-ky')
    .setDescription('Register Tournament!')
    .addStringOption((option) => option.setName('ingame').setDescription('ingame').setRequired(true)),
  /**
   * Register for a tournament
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    let register;
    if (!profile || !profile?.tournament?.status) register = false;
    else register = profile.tournament.status;
    if (register === false)
      return await interaction.reply(errorEmbed({ description: 'Hiện không có giải đấu nào diễn ra!', emoji: false }));

    // Interaction Reply
    const roleID = profile?.tournament?.id;
    const stIngame = options.getString('ingame');
    const role = guild.roles.cache.get(roleID);

    try {
      if (role) {
        // Add Tournament Profile
        let tourProfile = await tournamentProfile
          .findOne({
            guildID: guild.id,
            userID: user.id,
          })
          .catch(console.error);
        if (!tourProfile) {
          await tournamentProfile
            .create({
              guildID: guild.id,
              guildName: guild.name,
              userID: user.id,
              usertag: user.tag,
              ingame: stIngame,
              decklist: 'none',
              status: true,
            })
            .catch(console.error);
        } else {
          await tournamentProfile
            .findOneAndUpdate(
              { guildID: guild.id, userID: user.id },
              {
                guildName: guild.name,
                usertag: user.tag,
                ingame: stIngame,
                decklist: 'none',
                status: true,
              },
            )
            .catch(console.error);
        }

        await interaction.reply(
          errorEmbed({
            description: `${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**`,
            emoji: `\\🏆 `,
            color: Colors.Green,
          }),
        );

        await interaction.followUp(
          errorEmbed({ description: `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`, emoji: true }),
        );
        // Add Role
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
                description: `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`,
                emoji: false,
              }),
            );
          }
        } else await guild.members.cache.get(user.id).roles.add(role);
      }
    } catch (e) {
      console.error(chalk.red('Error while executing /dang-ky command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while executing /dang-ky command`, description: e, color: Colors.Red }),
      );
    }
  },
};
