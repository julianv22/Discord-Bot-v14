const { Client, Interaction } = require('discord.js');

module.exports = {
  type: 'buttons',
  data: { name: 'support' },
  /** Support Button
   * @param {Interaction} interaction Button Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const [, buttonId] = interaction.customId.split(':');

    const showContent = {
      youtube: () => `Hãy like, share và subscribe để ủng hộ cho [Julian-V](${cfg.youtubeLink}) nhé! 😘`,
      server: () => `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink,
    };

    await interaction.reply({ content: showContent[buttonId]() || 'Nothing here!', flags: 64 });
  },
};
