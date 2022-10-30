const serverProfile = require('../../config/serverProfile');
const tournamenProfile = require('../../config/tournamenProfile');
const { SlashCommandBuilder, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('huy-dang-ky')
    .setDescription('Huỷ đăng ký đấu giải!')
    .addBooleanOption(option => option.setName('xacnhan').setDescription('HÃY CHẮC CHẮN VỚI ĐIỀU BẠN SẮP LÀM!').setRequired(true)),
  category: 'tournament',
  cooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, user, options } = interaction;

    let profile = await serverProfile.findOne({ guildID: guild.id });
    let register;
    if (!profile || !profile?.tourStatus) register = false;
    else register = profile.tourStatus;

    if (register === false)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\🏆 | Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!` }],
        ephemeral: true,
      });

    // Verified
    if (options.getBoolean('xacnhan') === false)
      return interaction.reply({
        embeds: [{ color: 16763904, description: `❗ Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!` }],
        ephemeral: true,
      });

    // Check Tournament's Status
    let tourProfile = await tournamenProfile.findOne({ guildID: guild.id, userID: user.id });
    if (!tourProfile || !tourProfile?.status)
      return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | ${user} chưa đăng ký giải đấu!` }], ephemeral: true });
    
      // Interaction Reply
    const role = guild.roles.cache.get(profile?.tourID);
    await interaction.reply({ embeds: [{ color: 16711680, description: `\\🏆 | ${user} huỷ đăng ký giải ${role}!!` }] });
    
    // Set Tournament's Status
    await tournamenProfile.findOneAndUpdate({ guildID: guild.id, userID: user.id }, { status: false });

    // Remove Role
    if (role)
      await guild.members.cache
        .get(user.id)
        .roles.remove(role)
        .catch(e => console.error(e));
  },
};
