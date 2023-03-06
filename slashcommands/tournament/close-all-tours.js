const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const tournamenProfile = require('../../config/tournamenProfile');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('close-all-tours')
    .setDescription(`Đóng toàn bộ giải đấu. \n${cfg.adminRole} only`)
    .addBooleanOption(opt => opt.setName('verified').setDescription('Xác nhận đóng toàn bộ giải đấu').setRequired(true)),
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  cooldown: 0,

  /** @param {ChatInputCommandInteraction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    const verified = options.getBoolean('verified');
    if (!verified)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\❗ Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!` }],
        ephemeral: true,
      });

    // Set Tournament Status for member
    const tourList = await tournamenProfile.find({ guildName: guild.name });
    if (!tourList)
      return interaction.reply({
        embeds: [{ color: 16711680, description: `\\🏆 | Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!` }],
        ephemeral: true,
      });

    for (const member of tourList) {
      await tournamenProfile.findOneAndUpdate(
        {
          guildName: member.guildName,
          userID: member.userID,
        },
        { status: false }
      );
    }
    await serverProfile.findOneAndUpdate({ guildID: guild.id }, { tourStatus: false });

    interaction.reply({ embeds: [{ color: 65280, description: `\\🏆 | Đã đóng toàn bộ giải đấu!!` }], ephemeral: true }).catch(e => console.error(e));
  },
};
