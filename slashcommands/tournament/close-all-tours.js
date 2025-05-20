const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const tournamentProfile = require('../../config/tournamentProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('close-all-tours')
    .setDescription(`Close all Tournaments. \n${cfg.adminRole} only`)
    .addBooleanOption((opt) => opt.setName('verified').setDescription('Close confirm').setRequired(true)),
  category: 'tournament',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,

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
      if (!tourList || tourList.length == 0)
        return interaction.reply(
          errorEmbed(`\\🏆 | `, 'Hiện tại đã đóng đăng ký hoặc không có giải đấu nào đang diễn ra!'),
        );

      for (const member of tourList) {
        try {
          await tournamentProfile.findOneAndUpdate(
            {
              guildName: member.guildName,
              userID: member.userID,
            },
            { status: false },
          );
        } catch (e) {
          console.error(chalk.yellow.bold(`Error update tournament status of user:`, e));
          continue;
        }
      }

      await interaction.reply(errorEmbed(`\\🏆 | `, 'Đã đóng toàn bộ giải đấu!!')).catch((e) => console.error(e));
    } catch (e) {
      console.error(chalk.yellow.bold('Error (/close-all-tour):', e));
      return interaction.reply(errorEmbed(true, 'Error:', e));
    }
  },
};
