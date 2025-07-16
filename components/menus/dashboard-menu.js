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
      welcome: async () => await setupWelcome(interaction),
      statistics: async () => await setupStats(interaction),
      starboard: async () => await setupStarboard(interaction),
      suggest: async () => await setupSuggest(interaction),
      disable: async () => await setupDisable(interaction),
    };

    await interaction.deferUpdate();
    if (!onSelect[feature]()) throw new Error(chalk.yellow('Invalid feature', chalk.green(feature)));
  },
};
