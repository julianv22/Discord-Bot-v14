const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'suggest-menu' },
  /** - Statistics channel select menu
   * @param {Interaction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guildId,
      values,
      message: { components },
    } = interaction;
    const data = components[1].components[0].data;
    data.content = `### \\💡 Suggest Channel: <#${values[0]}>`;

    await serverProfile
      .findOneAndUpdate({ guildId }, { $set: { 'suggest.channelId': values[0] } })
      .catch(console.error);
    await interaction.update({ components });
  },
};
