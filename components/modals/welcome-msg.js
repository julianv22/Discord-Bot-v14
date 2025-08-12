const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'modals',
  data: { name: 'welcome-msg' },
  /** Welcome message modal
   * @param {Interaction} interaction Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guildId, message, fields, customId } = interaction;
    const { components } = message;
    const inputValue = fields.getTextInputValue(customId).slice(0, 3000);
    const welcomeMessage = components[1].components[1].components[1].data;

    welcomeMessage.content = inputValue;

    await serverProfile.findOneAndUpdate({ guildId }, { $set: { 'welcome.message': inputValue } }).catch(console.error);

    await interaction.editReply({ components });
  },
};
