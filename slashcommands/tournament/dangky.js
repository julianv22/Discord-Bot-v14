const serverProfile = require('../../config/serverProfile');
const tournamenProfile = require('../../config/tournamenProfile');

const { SlashCommandBuilder, Interaction, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dang-ky')
    .setDescription('Đăng ký đấu giải!')
    .addStringOption(option => option.setName('ingame').setDescription('Tên ingame').setRequired(true)),
  category: 'tournament',
  cooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, member } = interaction;
    const message = await interaction.deferReply({ fetchReply: true, ephemeral: true });
    let profile = await serverProfile.findOne({ guildID: guild.id });
    let register;
    if (!profile || !profile?.tourStatus) register = false;
    else register = profile.tourStatus;
    if (register === false)
      return interaction.editReply({ embeds: [{ color: 16711680, description: `\\❌ | Hiện không có giải đấu nào diễn ra!` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });

    // Interaction Reply
    const roleID = profile?.tourID;
    const stIngame = interaction.options.getString('ingame');
    const role = message.guild.roles.cache.get(roleID);
    const user = message.guild.members.cache.get(interaction.member.user.id);
    await message.channel.send({
      embeds: [{ color: 65280, description: `\\🏆 | ${user} đăng ký giải ${role}.\n🎮 | Tên ingame: **${stIngame}**` }],
    });
    await interaction.followUp({
      embeds: [{ color: 65280, description: `\\✅ | Chúc mừng ${user} đã đăng kí thành công giải ${role}!` }],
      ephemeral: true,
    });

    if (role) {
      // Add Tournament Profile
      let tourProfile = await tournamenProfile.findOne({ guildID: interaction.guild.id, userID: interaction.member.user.id });
      if (!tourProfile) {
        let createOne = await tournamenProfile.create({
          guildID: guild.id,
          guildName: guild.name,
          userID: member.user.id,
          usertag: member.user.tag,
          ingame: stIngame,
          decklist: 'none',
          status: true,
        });
        createOne.save();
      } else {
        await tournamenProfile.findOneAndUpdate(
          { guildID: guild.id, userID: member.user.id },
          {
            guildName: guild.name,
            usertag: member.user.tag,
            ingame: stIngame,
            decklist: 'none',
            status: true,
          }
        );
      }

      // Add Role
      return await user.roles.add(role).catch(e => console.log(e));
    }
  },
};
