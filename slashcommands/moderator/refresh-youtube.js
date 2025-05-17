const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('refresh-youtube')
    .setDescription(`Check new videos from Youtube. ${cfg.adminRole} only`),
  category: 'moderator',
  permissions: PermissionFlagsBits.Administrator,
  scooldown: 0,
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed, checkVideos } = client;
    await checkVideos();
    interaction.reply(errorEmbed(false, 'Refesh successfull!'));
  },
};
