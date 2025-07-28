const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'starboard-menu' },
  /** - Starboard Menu
   * @param {Interaction} interaction - Select Menu Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guildId, message, values, customId } = interaction;
    const { components } = message;
    const [, menu] = customId.split(':');
    const textDisplay = (id) => components[1].components[0].components[id].data;
    const profile = await serverProfile.findOne({ guildId });
    const { starboard } = profile || {};

    const onSelect = {
      channel: () => {
        starboard.channelId = values[0];
        return (textDisplay(1).content = `- \\💬 Starboard channel: <#${values[0]}>`);
      },
      starcount: () => {
        starboard.starCount = parseInt(values[0], 10);
        return (textDisplay(2).content = `- \\⭐ Stars required to send message: **${values[0]}**\\⭐`);
      },
    };

    if (!onSelect[menu]()) throw new Error(chalk.yellow('Invalid menu', chalk.green(menu)));
    await profile.save();
    await interaction.editReply({ components });
  },
};
