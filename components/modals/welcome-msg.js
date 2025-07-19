const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'modals',
  data: { name: 'welcome-msg' },
  /** - Welcome message modal
   * @param {Interaction} interaction Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    const {
      guildId,
      customId,
      fields,
      message: { components },
    } = interaction;
    const message = fields.getTextInputValue(customId).slice(0, 3000);
    const welcomeMessage = components[1].components[1].components[1].data;

    welcomeMessage.content = message;

    await serverProfile.findOneAndUpdate({ guildId }, { $set: { 'welcome.message': message } }).catch(console.error);

    await interaction.update({ components });
  },
};
