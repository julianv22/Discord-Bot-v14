const { Client, Interaction } = require('discord.js');
module.exports = {
  data: { name: 'support-btn' },
  /**
   * Support Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const [, button] = interaction.customId.split(':');
    const types = {
      youtube: () => {
        return `Hãy like, share và subscrible để ủng hộ cho [Julian-V](${cfg.youtube}) nhé! 😘`;
      },
      server: () => {
        return `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink;
      },
    };
    if (typeof types[button] === 'function')
      return await interaction.reply({ content: types[button](), ephemeral: true });
  },
};
