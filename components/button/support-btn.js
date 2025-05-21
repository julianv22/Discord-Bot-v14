const { Client, Interaction } = require('discord.js');

module.exports = {
  data: { name: 'support-btn' },

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const [, button] = interaction.customId.split(':');
    const types = {
      youtube: () => {
        return `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink;
      },
      server: () => {
        return `Hãy like, share và subscrible để ủng hộ cho [Julian-V](${cfg.youtube}) nhé! 😘`;
      },
    };

    return interaction.reply({ content: types[button](), ephemeral: true });
  },
};
