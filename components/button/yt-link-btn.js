const { Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'yt-link-btn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    await interaction.reply({ content: `Hãy like, share và subscrible để ủng hộ cho Julian-V nhé! 😘\n` + cfg.youtube, ephemeral: true });
  },
};
