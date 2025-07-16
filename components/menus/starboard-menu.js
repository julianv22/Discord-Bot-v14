const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'starboard-menu' },
  /** - Starboard Menu
   * @param {Interaction} interaction - String Select Menu Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      guildId: guildID,
      message: { components },
      customId,
      values,
    } = interaction;
    const [, menu] = customId.split(':');
    const value = values[0];
    const textDisplay = (id) => components[1].components[0].components[id].data;

    const profile = await serverProfile.findOne({ guildID });
    const { starboard } = profile?.setup || {};

    const onSelect = {
      channel: () => {
        starboard.channel = value;
        return (textDisplay(1).content = `- \\💬 Starboard channel: <#${value}>`);
      },
      star: () => {
        starboard.star = parseInt(value, 10);
        return (textDisplay(2).content = `- \\🔢 Number of stars to send message: **${value}**\\⭐`);
      },
    };

    if (!onSelect[menu]()) throw new Error(chalk.yellow('Invalid menu', chalk.green(menu)));
    await profile.save();
    await interaction.update({ components });
  },
};
