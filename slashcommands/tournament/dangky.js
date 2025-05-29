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
  /**
   * Register for a tournament
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, user, options } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
    let register;
    if (!profile || !profile?.tournament?.status) register = false;
    else register = profile.tournament.status;
    if (register === false) return await interaction.reply(errorEmbed(true, 'Hiện không có giải đấu nào diễn ra!'));

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
          .catch(() => {});
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
            .catch(() => {});
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
            .catch(() => {});
        }

        await interaction.reply({
          embeds: [
            {
              color: 65280,
              description: `\\🏆 | ${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**`,
            },
          ],
        });

        await interaction.followUp(errorEmbed(false, `Chúc mừng ${user} đã đăng kí thành công giải ${role}!`));
        // Add Role
        const bot = guild.members.me || (await guild.members.fetch(client.user.id));
        if (!bot.permissions.has(PermissionFlagsBits.Administrator)) {
          if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return await interaction.followUp(errorEmbed(true, `Bot cần quyền \`Manage Roles\` để gán role ${role}!`));
          }
          if (bot.roles.highest.position <= role.position) {
            return await interaction.followUp(
              errorEmbed(true, `Bot không thể gán role ${role} vì role này cao hơn hoặc bằng role của bot!`),
            );
          }
        } else await guild.members.cache.get(user.id).roles.add(role);
      }
    } catch (e) {
      console.error(chalk.red('Error while running command (/dang-ky):', e));
      return await interaction.reply(errorEmbed(true, 'Error while running command (/dang-ky):', e));
    }
  },
};
