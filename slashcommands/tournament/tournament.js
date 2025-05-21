const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Interaction, Role, Client } = require('discord.js');

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
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});

    // Đảm bảo profile luôn tồn tại
    if (!profile) profile = await serverProfile.create({ guildID: guild.id, guildName: guild.name });

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

        await serverProfile
          .findOneAndUpdate(
            { guildID: guild.id },
            {
              tourStatus: true,
              tourID: getRole.id,
              tourName: getRole.name,
            },
          )
          .catch(() => {});

        await interaction.reply({
          embeds: [
            {
              color: 65280,
              description: `\\🏆 | Đã mở đăng ký giải đấu ${getRole} thành công!`,
            },
          ],
        });
      },
      close: async () => {
        if (!getRole) return interaction.reply(errorEmbed(true, 'Bạn chưa chọn role giải đấu!'));

        if (profile.tourID && getRole.id !== profile.tourID)
          return interaction.reply(errorEmbed(true, `Chưa chọn đúng giải đấu: \`${profile.tourName}\``));

        if (!profile.tourStatus)
          return interaction.reply(errorEmbed(true, `Giải \`${profile.tourName}\` đã được đóng trước đó rồi!`));

        await serverProfile
          .findOneAndUpdate(
            { guildID: guild.id },
            {
              tourStatus: false,
              tourID: null,
              tourName: null,
            },
          )
          .catch(() => {});

        await interaction.reply({
          embeds: [
            {
              color: 65280,
              description: `\\🏆 | Đã đóng đăng ký giải đấu ${getRole} thành công!`,
            },
          ],
        });
      },
      list: async () => {
        if (!profile.tourStatus)
          return interaction.reply(errorEmbed(`\\🏆 | `, 'Hiện không có giải đấu nào đang diễn ra!'));

        let memberList = await tournamentProfile
          .find({
            guildID: guild.id,
            status: true,
          })
          .catch(() => {});

        if (!memberList || memberList.length === 0)
          return interaction.reply(errorEmbed(true, 'Chưa có thành viên nào đăng kí giải!'));

        const role = guild.roles.cache.get(profile.tourID);
        const tengiai = `**Tên giải:** ${role || 'Không có tên'}`;

        // Tạo danh sách thành viên, mỗi dòng 1 người
        const memberLines = memberList.map(
          (member, idx) => `${idx + 1}. <@${member.userID}> ing: **${member.ingame}**`,
        );
        const maxDescLength = 4000;
        const embeds = [];
        let page = 0;
        let current = 0;
        while (current < memberLines.length) {
          let desc = '';
          // Nếu là embed đầu tiên, thêm tên giải ở đầu
          if (current === 0) desc += tengiai + '\n\n';
          // Thêm từng dòng cho đến khi gần đạt giới hạn
          while (current < memberLines.length && (desc + memberLines[current] + '\n').length <= maxDescLength) {
            desc += memberLines[current] + '\n';
            current++;
          }
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
            })
            .setDescription(desc);
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
        const tourList = await tournamentProfile.find({ guildID: guild.id }).catch(() => {});

        if (!verified)
          return interaction.reply(errorEmbed(`\\❗ `, 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!'));

        if (!tourList || tourList.length === 0)
          return interaction.reply(
            errorEmbed(true, 'Hiện tại chưa có thành viên nào đăng ký hoặc không có giải đấu nào!'),
          );

        tourList.forEach(async (tour) => {
          tour.status = false;
          await tour.save().catch(() => {});
        });

        await serverProfile.findOneAndUpdate({ guildID: guild.id }, { tourStatus: false }).catch(() => {});
        await interaction.reply(errorEmbed(`\\🏆 | `, 'Đã huỷ toàn bộ giải đấu và đăng ký của tất cả thành viên!'));
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
