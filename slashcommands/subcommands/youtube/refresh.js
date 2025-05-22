const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('refresh'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  /**
   * Refresh the YouTube channels
   * @param {Interaction} interaction - The interaction object
   * @param {Client} client - The client object
   */
  async execute(interaction, client) {
    const { errorEmbed, checkVideos } = client;
    await checkVideos();
    await interaction.reply(errorEmbed(false, 'Refesh successfull!'));
  },
};
