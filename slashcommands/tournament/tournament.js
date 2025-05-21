const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Interaction, Role, Client } = require('discord.js');
/**
 * @param {Interaction} interaction
 * @param {Role} getRole
 * @param {Boolean} isOpen
 * @param {String} stStatus
 */
async function setTournament(interaction, getRole, isOpen, stStatus) {
  await interaction.reply({
    embeds: [
      {
        color: 65280,
        description: `\\🏆 | Đã ${stStatus} đăng ký giải đấu ${getRole} thành công!`,
      },
    ],
  });
  await serverProfile.findOneAndUpdate(
    { guildID: interaction.guild.id },
    {
      guildName: interaction.guild.name,
      tourID: getRole.id,
      tourName: getRole.name,
      tourStatus: isOpen,
    },
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('tournament')
    .setDescription(`Set up tournament.\n${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('open')
        .setDescription(`Mở đăng ký giải đấu.\n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn giải đấu').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('close')
        .setDescription(`Đóng đăng ký giải đấu.\n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn giải đấu').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription(`Danh sách thành viên tham gia giải đấu.\n${cfg.adminRole} only`),
    )
    .addSubcommand((sub) =>
      sub
        .setName('close-all')
        .setDescription(`Huỷ đăng ký của tất cả thành viên trong guild.\n${cfg.adminRole} only`)
        .addBooleanOption((opt) => opt.setName('confirm').setDescription('Xác nhận').setRequired(true)),
    ),
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, options } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id });

    // Đảm bảo profile luôn tồn tại
    if (!profile) {
      profile = await serverProfile.create({ guildID: guild.id, guildName: guild.name });
    }

    const getRole = options.getRole('ten-giai');
    const tourCommand = options.getSubcommand();

    // Gom các logic xử lý vào object
    const tourActions = {
      open: async () => {
        if (!getRole) return interaction.reply(errorEmbed(true, 'Bạn chưa chọn role giải đấu!'));

        if (profile.tourStatus && getRole.id !== profile.tourID)
          return interaction.reply(
            errorEmbed(true, `Đang có giải đấu \`${profile.tourName}\` diễn ra. Vui lòng đóng giải này trước!`),
          );

        if (profile.tourStatus)
          return interaction.reply(errorEmbed(true, `Giải \`${profile.tourName}\` đang diễn ra rồi!`));

        await setTournament(interaction, getRole, true, 'mở');
      },
      close: async () => {
        if (!getRole) return interaction.reply(errorEmbed(true, 'Bạn chưa chọn role giải đấu!'));

        if (profile.tourID && getRole.id !== profile.tourID)
          return interaction.reply(errorEmbed(true, `Chưa chọn đúng giải đấu: \`${profile.tourName}\``));

        if (!profile.tourStatus)
          return interaction.reply(errorEmbed(true, `Giải \`${profile.tourName}\` đã được đóng trước đó rồi!`));

        await setTournament(interaction, getRole, false, 'đóng');
      },
      list: async () => {
        if (!profile.tourStatus)
          return interaction.reply(errorEmbed(`\\🏆 | `, 'Hiện không có giải đấu nào đang diễn ra!'));

        let memberList = await tournamentProfile.find({
          guildID: guild.id,
          status: true,
        });

        if (!memberList || memberList.length === 0)
          return interaction.reply(errorEmbed(true, 'Chưa có thành viên nào đăng kí giải!'));

        const role = guild.roles.cache.get(profile.tourID);
        const tengiai = `**Tên giải:** ${role || 'Không có tên'}`;

        // Chia nhỏ thành nhiều embed nếu quá dài hoặc quá nhiều thành viên
        const embeds = [];
        const chunkSize = 25;
        let total = memberList.length;
        let page = 0;
        for (let i = 0; i < total; i += chunkSize) {
          const chunk = memberList.slice(i, i + chunkSize);
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `🏆 Danh sách thành viên tham gia giải đấu`,
              iconURL: guild.iconURL(true),
            })
            .setColor('Random')
            .setThumbnail('https://media.discordapp.net/attachments/976364997066231828/1001763832009596948/Cup.jpg')
            .setTimestamp()
            .setFooter({
              text: `Trang ${++page} | Tổng số đăng ký: [${memberList.length}]`,
              iconURL: client.user.displayAvatarURL(),
            });

          // Nếu là embed đầu tiên, thêm tên giải vào description
          if (i === 0) embed.setDescription(tengiai);

          chunk.forEach((member) => {
            embed.addFields([
              {
                name: `\u200b`,
                value: `<@${member.userID}> (${member.ingame})`,
                inline: true,
              },
            ]);
          });

          embeds.push(embed);
        }

        // Gửi lần lượt các embed
        for (let i = 0; i < embeds.length; i++) {
          if (i === 0) {
            await interaction.reply({ embeds: [embeds[i]] });
          } else {
            await interaction.followUp({ embeds: [embeds[i]] });
          }
        }
      },
      'close-all': async () => {
        const verified = options.getBoolean('confirm');
        const tourList = await tournamentProfile.find({ guildID: guild.id });

        if (!verified)
          return interaction.reply(errorEmbed(`\\❗ `, 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!'));

        if (!tourList || tourList.length === 0)
          return interaction.reply(
            errorEmbed(true, 'Hiện tại chưa có thành viên nào đăng ký hoặc không có giải đấu nào!'),
          );

        tourList.forEach(async (tour) => {
          tour.status = false;
          await tour.save();
        });

        await interaction.reply(errorEmbed(`\\🏆 | `, 'Đã huỷ đăng ký của tất cả thành viên trong guild'));
      },
    };

    try {
      if (tourActions[tourCommand]) {
        await tourActions[tourCommand]();
      } else {
        return interaction.reply(errorEmbed(true, 'Subcommand không hợp lệ!'));
      }
    } catch (e) {
      console.error(chalk.yellow.bold(`Error while running tournament command [${tourCommand}]:`, e));
      return interaction.reply(errorEmbed(true, `Error while running tournament command [${tourCommand}]:`, e));
    }
  },
};
