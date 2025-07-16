const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'modals',
  data: { name: 'welcome-msg' },
  /** - Welcome message modal
   * @param {Interaction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    const {
      guildId: guildID,
      message: { components },
      fields,
      customId,
    } = interaction;
    const input = fields.getTextInputValue(customId).slice(0, 3000);
    const welcomeMessage = components[1].components[1].components[1].data;

    welcomeMessage.content = input;

    await serverProfile
      .findOneAndUpdate({ guildID }, { $set: { 'setup.welcome.message': input } })
      .catch(console.error);

    await interaction.update({ components });
  },
};
