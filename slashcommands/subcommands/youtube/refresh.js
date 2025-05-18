const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('refresh'),
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed, checkVideos } = client;
    await checkVideos();
    interaction.reply(errorEmbed(false, 'Refesh successfull!'));
  },
};
