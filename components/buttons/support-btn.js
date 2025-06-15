const { Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  data: { name: 'support-btn' },
  /**
   * Support Button
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { catchError } = client;
    const [, button] = interaction.customId.split(':');

    try {
      const types = {
        youtube: () => {
          return `Hãy like, share và subscrible để ủng hộ cho [Julian-V](${cfg.youtube}) nhé! 😘`;
        },
        server: () => {
          return `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink;
        },
      };

      if (!types[button]) throw new Error(chalk.yellow("Invalid button's customId ") + chalk.green(button));

      return await interaction.reply({ content: types[button](), flags: 64 });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
