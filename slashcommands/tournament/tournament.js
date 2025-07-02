const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('tournament')
    .setDescription(`🏆 Set up tournament.\n${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('open')
        .setDescription(`🏆 Mở đăng ký giải đấu.\n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn giải đấu').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('close')
        .setDescription(`🏆 Đóng đăng ký giải đấu.\n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn giải đấu').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription(`🏆 Danh sách thành viên tham gia giải đấu.\n${cfg.adminRole} only`)
    )
    .addSubcommand((sub) =>
      sub
        .setName('close-all')
        .setDescription(`🏆 Huỷ đăng ký của tất cả thành viên trong guild.\n${cfg.adminRole} only`)
        .addBooleanOption((opt) => opt.setName('confirm').setDescription('Xác nhận').setRequired(true))
    ),
  /** - Setup giải đấu (open/close/list ds thành viên tham gia)
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const { errorEmbed } = client;
    const tourCommand = options.getSubcommand();
    const getRole = options.getRole('ten-giai');

    let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
    if (!profile)
      profile = serverProfile.create({ guildID: guild.id, guildName: guild.name, prefix: prefix }).catch(console.error);

    const { tournament } = profile;
    // Gom các logic xử lý vào object
    const tourActions = {
      open: async () => {
        if (tournament.status && getRole.id !== tournament.id)
          return await interaction.reply(
            errorEmbed({
              desc: `Đang có giải đấu \`${tournament.name}\` diễn ra. Vui lòng đóng giải này trước!`,
              emoji: false,
            })
          );

        if (tournament.status)
          return await interaction.reply(errorEmbed({ desc: `Giải \`${tournament.name}\` đang diễn ra rồi!` }));

        tournament.status = true;
        tournament.id = getRole.id;
        tournament.name = getRole.name;
        await profile.save().catch(console.error);

        return await interaction.reply(
          errorEmbed({
            desc: `Đã mở đăng ký giải đấu ${getRole} thành công!`,
            emoji: '🏆',
            color: Colors.DarkGreen,
          })
        );
      },
      close: async () => {
        if (tournament.id && getRole.id !== tournament.id)
          return await interaction.reply(errorEmbed({ desc: `Chưa chọn đúng giải đấu: \`${tournament.name}\`` }));

        if (!tournament.status)
          return await interaction.reply(
            errorEmbed({ desc: `Giải \`${tournament.name}\` đã được đóng trước đó rồi!` })
          );

        tournament.status = false;
        tournament.id = null;
        tournament.name = null;
        await profile.save().catch(console.error);

        return await interaction.reply(
          errorEmbed({ desc: `Đã đóng đăng ký giải đấu ${getRole} thành công!`, emoji: '🏆', color: Colors.DarkGreen })
        );
      },
      list: async () => {
        if (!tournament.status)
          return await interaction.reply(
            errorEmbed({
              desc: 'Hiện không có giải đấu nào đang diễn ra!',
              emoji: '🏆',
              color: Colors.DarkVividPink,
            })
          );

        let memberList = await tournamentProfile.find({ guildID: guild.id, status: true }).catch(console.error);
        if (!memberList || memberList.length === 0)
          return await interaction.reply(errorEmbed({ desc: 'Chưa có thành viên nào đăng kí giải!' }));

        const role = guild.roles.cache.get(tournament.id);
        const tengiai = `**Tên giải:** ${role || 'Unnamed'}`;
        // Tạo danh sách thành viên, mỗi dòng 1 người
        const memberLines = memberList.map(
          (member, idx) => `${idx + 1}. <@${member.userID}> ing: **${member.ingame}**`
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
              name: '🏆 Danh sách thành viên tham gia giải đấu',
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
        return;
      },
      'close-all': async () => {
        const verified = options.getBoolean('confirm'),
          tourList = await tournamentProfile.find({ guildID: guild.id }).catch(console.error);

        if (!verified)
          return await interaction.reply(
            errorEmbed({
              desc: 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!',
              emoji: '❗',
              color: Colors.Orange,
            })
          );

        if (!tourList || tourList.length === 0)
          return await interaction.reply(
            errorEmbed({
              desc: 'Hiện tại chưa có thành viên nào đăng ký hoặc không có giải đấu nào!',
              emoji: false,
            })
          );

        for (const tour of tourList) {
          tour.status = false;
          await tour.save().catch(console.error);
        }

        tournament.status = false;
        tournament.id = null;
        tournament.name = null;
        await profile.save().catch(console.error);

        return await interaction.reply(
          errorEmbed({
            desc: 'Đã huỷ toàn bộ giải đấu và đăng ký của tất cả thành viên!',
            emoji: '🏆',
            color: Colors.DarkGreen,
          })
        );
      },
    };

    if (!tourActions[tourCommand]) {
      await interaction.reply(errorEmbed({ desc: 'Subcommand không hợp lệ!' }));
      throw new Error(chalk.yellow('Invalid Subcommand ') + chalk.green(tourCommand));
    } else await tourActions[tourCommand]();
  },
};
