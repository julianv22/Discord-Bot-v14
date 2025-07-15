const { Client, Interaction } = require('discord.js');

module.exports = {
  type: 'menus',
  data: { name: 'dashboard-menu' },
  /** - Statistics channel select menu
   * @param {Interaction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { setupWelcome, setupStats, setupStarboard, setupSuggest, setupDisable } = client;
    const feature = interaction.values[0];

    const onSelect = {
      welcome: async () => {
        await setupWelcome(interaction);
        return true;
      },
      statistics: async () => {
        await setupStats(interaction);
        return true;
      },
      starboard: async () => {
        await setupStarboard(interaction);
        return true;
      },
      suggest: async () => {
        await setupSuggest(interaction);
        return true;
      },
      disable: async () => {
        await setupDisable(interaction);
        return true;
      },
    };

    await interaction.deferUpdate();
    if (!onSelect[feature]) throw new Error(chalk.yellow('Invalid feature', chalk.green(feature)));
    await onSelect[feature]();
  },
};
