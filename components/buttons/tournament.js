const { Client, Interaction, EmbedBuilder, ContainerBuilder, FileBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const XLSX = require('xlsx');
const { textDisplay } = require('../../functions/common/components');
module.exports = {
  type: 'buttons',
  data: { name: 'tournament' },
  /** - Support Button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guild,
      guildId,
      customId,
      message: { components },
    } = interaction;
    const { errorEmbed } = client;
    const [, buttonId] = customId.split(':');
    const tourName = components[0].components[0].components[1].data;
    const tourStatus = components[0].components[0].components[2].data;

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    const { tournament } = profile || {};

    if (!tournament?.roleId) return await interaction.reply(errorEmbed({ desc: 'Chưa chọn tên role cho giải đấu!' }));

    const getRole = (roleId) => guild.roles.cache.get(roleId) || '*\\❌ Chưa có giải nào*';

    const onClick = {
      open: async () => {
        if (tournament?.isActive)
          return await interaction.reply(
            errorEmbed({ desc: `Giải đấu ${getRole(tournament?.roleId)} đã được mở!`, emoji: '🏆', color: Colors.Red })
          );

        tournament.isActive = true;
        tourName.content = `- Tournament name: ${getRole(tournament?.roleId)}`;
        tourStatus.content = '- Status: \\✅ Open';

        await profile.save().catch(console.error);
        await interaction.update({ components });
        await interaction.channel.send(
          errorEmbed({
            desc: `**Đã mở đăng ký giải đấu ${getRole(tournament?.roleId)}!**\n\nSử dụng \`/dang-ky\` để đăng ký giải!`,
            emoji: '🏆',
            color: Colors.DarkGreen,
          })
        );
      },
      close: async () => {
        if (!tournament?.isActive)
          return await interaction.reply(
            errorEmbed({ desc: `Giải đấu ${getRole(tournament?.roleId)} đã bị đóng!`, emoji: '🏆', color: Colors.Red })
          );

        tournament.isActive = false;
        tourName.content = `- Tournament name: ${getRole(tournament?.roleId)}`;
        tourStatus.content = '- Status: *\\❌ Closed*';

        await profile.save().catch(console.error);
        await interaction.update({ components });
        await interaction.channel.send(
          errorEmbed({
            desc: `**Đã đóng đăng ký giải đấu ${getRole(tournament?.roleId)}!**\n\nHẹn gặp lại vào giải đấu lần sau!`,
            emoji: '🏆',
            color: Colors.DarkVividPink,
          })
        );
      },
      close_all: async () => {
        const tournamentProfiles = await tournamentProfile.find({ guildId }).catch(console.error);
        if (!tournamentProfiles || tournamentProfiles.length === 0)
          return await interaction.reply(errorEmbed({ desc: 'Hiện tại chưa có thành viên nào đăng ký!' }));

        for (const profile of tournamentProfiles) profile.isActive = false;
        await tournamentProfile.bulkSave(tournamentProfiles).catch(console.error);

        tournament.isActive = false;
        tournament.roleId = '';
        tournament.roleName = '';
        tourName.content = '- Tournament name: *\\❌ Chưa có giải nào*';
        tourStatus.content = '- Status: *\\❌ Closed*';

        await profile.save().catch(console.error);
        await interaction.update({ components });
      },
      list: async () => {
        if (!tournament?.isActive)
          return await interaction.reply(
            errorEmbed({
              desc: `Giải đấu ${getRole(tournament?.roleId)} chưa được mở!`,
              emoji: '🏆',
              color: Colors.Red,
            })
          );

        const memberList = await tournamentProfile.find({ guildId, registrationStatus: true }).catch(console.error);
        if (!memberList || memberList.length === 0)
          return await interaction.reply(errorEmbed({ desc: 'Chưa có thành viên nào đăng kí giải!' }));

        const tengiai = `**Tên giải:** ${getRole(tournament?.roleId)}`;
        // Tạo danh sách thành viên, mỗi dòng 1 người
        const memberLines = memberList.map(
          (member, idx) => `${idx + 1}. <@${member?.userId}> --- \\🎮 Ingame: **${member?.inGameName}**`
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
            .setColor(Math.random() * 0xffffff)
            .setThumbnail(cfg.game_gif)
            .setAuthor({ name: 'Danh sách thành viên tham gia giải đấu', iconURL: cfg.tournament_gif })
            .setDescription(desc)
            .setFooter({
              text: `Trang ${++page} | Tổng số đăng ký: [${memberList.length}]`,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          embeds.push(embed);
        }

        // Gửi lần lượt các embed
        for (let i = 0; i < embeds.length; i++) {
          if (i === 0) await interaction.reply({ embeds: [embeds[i]] });
          else await interaction.followUp({ embeds: [embeds[i]] });
        }
      },
      to_excel: async () => {
        const memberList = await tournamentProfile.find({ guildId, registrationStatus: true }).catch(console.error);
        if (!memberList || memberList.length === 0)
          return await interaction.reply(errorEmbed({ desc: 'Chưa có thành viên nào đăng kí giải!' }));

        // Tạo dữ liệu cho Excel
        const excelData = [['STT', 'Username', 'Ingame']];
        memberList.forEach((member, id) => {
          excelData.push([id + 1, member?.userName || 'Không xác định', member?.inGameName || 'Không xác định']);
        });

        // Tạo workbook và worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'DanhSachThanhVien');

        // Ghi workbook ra buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const container = new ContainerBuilder()
          .setAccentColor(Colors.DarkGreen)
          .addTextDisplayComponents(textDisplay('\\🏆 Danh sách thành viên tham gia giải đấu'))
          .addFileComponents(new FileBuilder().setURL(`attachment://DanhSachThanhVien.xlsx`));

        await interaction.reply({
          components: [container],
          files: [{ attachment: buffer, name: `DanhSachThanhVien.xlsx` }],
          flags: [32768, 64],
        });
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow('Invalid buttonId'), chalk.green(buttonId));
  },
};
