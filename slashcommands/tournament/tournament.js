const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Interaction, Client } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
module.exports = {
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,
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
  /**
   * Execute the tournament command
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, options } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    if (!profile)
      await serverProfile.create({ guildID: guild.id, guildName: guild.name, prefix: cfg.prefix }).catch(console.error);

    const getRole = options.getRole('ten-giai');
    const tourCommand = options.getSubcommand();
    const { tournament } = profile;
    // Gom các logic xử lý vào object
    const tourActions = {
      open: async () => {
        if (!getRole)
          return await interaction.reply(errorEmbed({ description: 'Bạn chưa chọn role giải đấu!', emoji: false }));

        if (tournament.status && getRole.id !== tournament.id)
          return await interaction.reply(
            errorEmbed({
              description: `Đang có giải đấu \`${tournament.name}\` diễn ra. Vui lòng đóng giải này trước!`,
              emoji: false,
            }),
          );

        if (tournament.status)
          return await interaction.reply(
            errorEmbed({ description: `Giải \`${tournament.name}\` đang diễn ra rồi!`, emoji: false }),
          );

        await serverProfile
          .findOneAndUpdate({ guildID: guild.id }, { tournament: { status: true, id: getRole.id, name: getRole.name } })
          .catch(console.error);

        await interaction.reply(
          errorEmbed({
            description: `Đã mở đăng ký giải đấu ${getRole} thành công!`,
            emoji: `\\🏆 `,
            color: 'Green',
          }),
        );
      },
      close: async () => {
        if (!getRole)
          return await interaction.reply(errorEmbed({ description: 'Bạn chưa chọn role giải đấu!', emoji: false }));

        if (tournament.id && getRole.id !== tournament.id)
          return await interaction.reply(
            errorEmbed({ description: `Chưa chọn đúng giải đấu: \`${tournament.name}\``, emoji: false }),
          );

        if (!tournament.status)
          return await interaction.reply(
            errorEmbed({ description: `Giải \`${tournament.name}\` đã được đóng trước đó rồi!`, emoji: false }),
          );

        await serverProfile
          .findOneAndUpdate({ guildID: guild.id }, { tournament: { status: false, id: null, name: null } })
          .catch(console.error);

        await interaction.reply(
          errorEmbed({
            description: `Đã đóng đăng ký giải đấu ${getRole} thành công!`,
            emoji: `\\🏆 `,
            color: 'Green',
          }),
        );
      },
      list: async () => {
        if (!tournament.status)
          return await interaction.reply(
            errorEmbed({ description: 'Hiện không có giải đấu nào đang diễn ra!', emoji: `\\🏆`, color: 'Red' }),
          );

        let memberList = await tournamentProfile
          .find({
            guildID: guild.id,
            status: true,
          })
          .catch(console.error);

        if (!memberList || memberList.length === 0)
          return await interaction.reply(
            errorEmbed({ description: 'Chưa có thành viên nào đăng kí giải!', emoji: false }),
          );

        const role = guild.roles.cache.get(tournament.id);
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
        const tourList = await tournamentProfile.find({ guildID: guild.id }).catch(console.error);

        if (!verified)
          return await interaction.reply(
            errorEmbed({
              description: 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!',
              emoji: `\\❗ `,
              color: 'Orange',
            }),
          );

        if (!tourList || tourList.length === 0)
          return await interaction.reply(
            errorEmbed({
              description: 'Hiện tại chưa có thành viên nào đăng ký hoặc không có giải đấu nào!',
              emoji: false,
            }),
          );

        tourList.forEach(async (tour) => {
          tour.status = false;
          await tour.save().catch(console.error);
        });

        await serverProfile
          .findOneAndUpdate({ guildID: guild.id }, { tournament: { status: false } })
          .catch(console.error);
        await interaction.reply(
          errorEmbed({
            description: 'Đã huỷ toàn bộ giải đấu và đăng ký của tất cả thành viên!',
            emoji: `\\🏆 `,
            color: 'Green',
          }),
        );
      },
    };

    try {
      if (tourActions[tourCommand]) {
        await tourActions[tourCommand]();
      } else {
        return await interaction.reply(errorEmbed({ description: 'Subcommand không hợp lệ!', emoji: false }));
      }
    } catch (e) {
      console.error(chalk.red(`Error while executing /tournament command [${tourCommand}]:`, e));
      return await interaction.reply(
        errorEmbed({
          title: `\\❌ Error while executing /tournament command [${tourCommand}]:`,
          description: e,
          color: 'Red',
        }),
      );
    }
  },
};
