const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'tournament' },
  /** - Support Button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guild,
      guildId: guildID,
      customId,
      message: { components },
    } = interaction;
    const { errorEmbed } = client;
    const [, buttonId] = customId.split(':');
    const tourName = components[0].components[0].components[1].data;
    const tourStatus = components[0].components[0].components[2].data;

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    const { tournament } = profile || {};

    if (!tournament.id)
      return await interaction.reply(
        errorEmbed({ desc: 'Chưa chọn tên role cho giải đấu!', emoji: '🏆', color: Colors.Red })
      );

    const getRole = (roleId) => guild.roles.cache.get(roleId) || '*\\❌ Chưa có giải nào*';

    const onClick = {
      open: async () => {
        if (tournament?.status)
          return await interaction.reply(
            errorEmbed({ desc: `Giải đấu ${getRole(tournament?.id)} đã được mở!`, emoji: '🏆', color: Colors.Red })
          );

        tournament.status = true;
        tourName.content = `- Tournament name: ${getRole(tournament?.id)}`;
        tourStatus.content = '- Status: \\✅ Open';

        await profile.save().catch(console.error);
        await interaction.update({ components });
      },
      close: async () => {
        if (!tournament?.status)
          return await interaction.reply(
            errorEmbed({ desc: `Giải đấu ${getRole(tournament?.id)} đã bị đóng!`, emoji: '🏆', color: Colors.Red })
          );

        tournament.status = false;
        tourName.content = `- Tournament name: ${getRole(tournament?.id)}`;
        tourStatus.content = '- Status: *\\❌ Closed*';

        await profile.save().catch(console.error);
        await interaction.update({ components });
      },
      close_all: async () => {
        const tournaments = await tournamentProfile.find({ guildID }).catch(console.error);
        if (!tournaments || tournaments.length === 0)
          return await interaction.reply(
            errorEmbed({ desc: 'Hiện tại chưa có thành viên nào đăng ký!', emoji: '🏆', color: Colors.Red })
          );

        for (const tournament of tournaments) tournament.status = false;
        await tournamentProfile.bulkSave(tournaments).catch(console.error);

        tournament.status = false;
        tournament.id = '';
        tournament.name = '';
        tourName.content = '- Tournament name: *\\❌ Chưa có giải nào*';
        tourStatus.content = '- Status: *\\❌ Closed*';

        await profile.save().catch(console.error);
        await interaction.update({ components });
      },
      list: async () => {
        if (!tournament.status)
          return await interaction.reply(
            errorEmbed({ desc: `Giải đấu ${getRole(tournament.id)} chưa được mở!`, emoji: '🏆', color: Colors.Red })
          );

        const memberList = await tournamentProfile.find({ guildID, status: true }).catch(console.error);
        if (!memberList || memberList.length === 0)
          return await interaction.reply(
            errorEmbed({ desc: 'Chưa có thành viên nào đăng kí giải!', emoji: '🏆', color: Colors.Red })
          );

        const tengiai = `**Tên giải:** ${getRole(tournament.id)}`;
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
            .setColor('Random')
            .setThumbnail('https://media.discordapp.net/attachments/976364997066231828/1001763832009596948/Cup.jpg')
            .setAuthor({
              name: '🏆 Danh sách thành viên tham gia giải đấu',
              iconURL: guild.iconURL(true),
            })
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
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow('Invalid buttonId'), chalk.green(buttonId));
  },
};
