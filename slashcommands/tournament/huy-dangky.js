const serverProfile = require('../../config/serverProfile');
const tournamenProfile = require('../../config/tournamenProfile');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('huy-dang-ky')
    .setDescription('Huỷ đăng ký đấu giải!')
    .addBooleanOption(option => option.setName('xacnhan').setDescription('HÃY CHẮC CHẮN VỚI ĐIỀU BẠN SẮP LÀM!').setRequired(true)),
  category: 'tournament',
  cooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    let profile = await serverProfile.findOne({ guildID: interaction.guild.id });
    let register;
    if (!profile || !profile?.tourStatus) register = false;
    else register = profile.tourStatus;

    if (register === false)
      return interaction.editReply({
        embeds: [{ color: 16711680, description: `\\🏆 | Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!` }],
        ephemeral: true,
      });

    const xacnhan = interaction.options.getBoolean('xacnhan');
    if (xacnhan === false)
      return interaction
        .editReply({ embeds: [{ color: 16763904, description: `❗ Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!` }] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        });
    const roleID = profile?.tourID;
    const role = message.guild.roles.cache.get(roleID);
    const user = message.guild.members.cache.get(interaction.member.user.id);

    // Check Tournament's Status
    let tourProfile = await tournamenProfile.findOne({ guildID: interaction.guild.id, userID: interaction.member.user.id });
    if (!tourProfile || !tourProfile?.status)
      return interaction.editReply({ embeds: [{ color: 16711680, description: `\\❌ | ${interaction.user} chưa đăng ký giải đấu!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    // Interaction Reply
    await interaction.editReply({ embeds: [{ color: 16711680, description: `\\🏆 | ${interaction.user} huỷ đăng ký giải ${role}!!` }] });
    // Set Tournament's Status
    await tournamenProfile.findOneAndUpdate(
      {
        guildID: interaction.guild.id,
        userID: interaction.member.user.id,
      },
      { status: false }
    );

    // Remove Role
    if (role) await user.roles.remove(role).catch(e => console.log(e));
  },
};
