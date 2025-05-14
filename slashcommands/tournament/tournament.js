const serverProfile = require('../../config/serverProfile');
const tournamentProfile = require('../../config/tournamentProfile');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Interaction,
  Role,
  Client,
  messageLink,
} = require('discord.js');
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
    .setDescription(`Cài đặt giải đấu. \n${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('open')
        .setDescription(`Mở đăng ký giải đấu. \n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn tên giải đấu').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('close')
        .setDescription(`Đóng đăng ký giải đấu. \n${cfg.adminRole} only`)
        .addRoleOption((opt) => opt.setName('ten-giai').setDescription('Chọn tên giải đấu').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription(`List danh sách thành viên tham gia giải đấu. \n${cfg.adminRole} only`),
    ),
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  cooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, options } = interaction;
    let profile = await serverProfile.findOne({ guildID: guild.id });
    if (!profile) {
      let createOne = await serverProfile.create({
        guildID: guild.id,
        guildName: guild.name,
      });
      createOne.save();
    }
    const getRole = options.getRole('ten-giai');

    switch (options.getSubcommand()) {
      case 'open':
        if (getRole.id !== profile?.tourID && profile?.tourStatus)
          return interaction.reply(
            errorEmbed(true, `Đang có giải đấu \`${profile?.tourName}\` diễn ra. Vui lòng đóng giải này trước!`),
          );
        if (profile?.tourStatus)
          return interaction.reply(errorEmbed(true, `Giải \`${profile?.tourName}\` đang diễn ra rồi!`));
        await setTournament(interaction, getRole, true, 'mở');
        break;
      case 'close':
        if (profile?.tourID && getRole.id !== profile?.tourID)
          return interaction.reply(errorEmbed(true, `Chưa chọn đúng giải đấu: \`${profile?.tourName}\``));
        if (!profile?.tourStatus)
          return interaction.reply(errorEmbed(true, `Giải \`${profile?.tourName}\` đã được đóng trước đó rồi!`));
        await setTournament(interaction, getRole, false, 'đóng');
        break;
      case 'list':
        if (!profile?.tourStatus)
          return interaction.reply(errorEmbed(`\\🏆 | `, 'Hiện không có giải đấu nào đang diễn ra!'));

        let memberList = await tournamentProfile.find({
          guildID: guild.id,
          status: true,
        });

        if (memberList.length == 0) return interaction.reply(errorEmbed(true, 'Chưa có thành viên nào đăng kí giải!'));

        const tengiai = `**Tên giải:** ${guild.roles.cache.get(profile.tourID)}`;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Danh sách thành viên tham gia giải đấu`,
            iconURL: guild.iconURL(true),
          })
          .setDescription(tengiai)
          .setColor('Random')
          .setThumbnail('https://media.discordapp.net/attachments/976364997066231828/1001763832009596948/Cup.jpg')
          .setTimestamp()
          .setFooter({ text: `Tổng số đăng ký: [${memberList.length}]` });

        let msg = [];
        memberList.forEach((member) => {
          if (memberList.length < 26) {
            embed.addFields([
              {
                name: `\u200b`,
                value: `<@${member.userID}> (${member.ingame})`,
                inline: true,
              },
            ]);
          } else {
            msg.push(`<@${member.userID}> (${member.ingame})`);
          }
        });

        const desc = tengiai + `\n\n${msg.join('\n')}`;
        if (memberList.length > 25 && desc.length < 1950) embed.setDescription(desc);

        await interaction.reply({ embeds: [embed] }).then(() => {
          if (desc.length > 1950) interaction.followUp(msg.join('\n'));
        });
        break;
    }
  },
};
