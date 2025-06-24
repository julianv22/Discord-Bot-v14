const { Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
  type: 'buttons',
  data: { name: 'support-btn' },
  /** - Support Button
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const [, button] = interaction.customId.split(':');

    const showContent = {
      youtube: () => {
        return `Hãy like, share và subscrible để ủng hộ cho [Julian-V](${cfg.youtube}) nhé! 😘`;
      },
      server: () => {
        return `Tham gia \`${cfg.supportServer}\` để được hỗ trợ!\n` + cfg.supportLink;
      },
    };

    if (!showContent[button]) throw new Error(chalk.yellow("Invalid button's customId ") + chalk.green(button));

    return await interaction.reply({ content: showContent[button](), flags: 64 });
  },
};
