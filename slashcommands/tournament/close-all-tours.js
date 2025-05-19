const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('close-all-tours')
    .setDescription(`Đóng toàn bộ giải đấu. \n${cfg.adminRole} only`)
    .addBooleanOption((opt) =>
      opt.setName('verified').setDescription('Xác nhận đóng toàn bộ giải đấu').setRequired(true),
    ),
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  cooldown: 0,

  /** @param {ChatInputCommandInteraction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { guild, options } = interaction;
    const verified = options.getBoolean('verified');

    try {
      if (!verified)
        return interaction.reply(errorEmbed(`\\❗ `, 'Hãy suy nghĩ cẩn thận trước khi đưa ra quyết định!'));

      // Set Tournament Status for member
      const tourList = await tournamentProfile.find({ guildName: guild.name });
      if (!tourList)
        return interaction.reply(
          errorEmbed(`\\🏆 | `, 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!'),
        );

      for (const member of tourList) {
        await tournamentProfile.findOneAndUpdate(
          {
            guildName: member.guildName,
            userID: member.userID,
          },
          { status: false },
        );
      }

      await interaction.reply(errorEmbed(`\\🏆 | `, 'Đã đóng toàn bộ giải đấu!!')).catch((e) => console.error(e));
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/close-all-tour):', e));
      return interaction.reply(errorEmbed(true, 'Error:', e));
    }
  },
};
