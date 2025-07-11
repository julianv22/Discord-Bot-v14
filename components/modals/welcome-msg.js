const { Client, ModalMessageModalSubmitInteraction, MessageFlags } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'modals',
  data: { name: 'welcome-msg' },
  /** - Welcome message modal
   * @param {ModalMessageModalSubmitInteraction} interaction Modal Message Modal Submit Interaction
   * @param {Client} client Discord Client*/
  async execute(interaction, client) {
    const {
      guildId: guildID,
      message: { components },
      fields,
      customId,
    } = interaction;
    const input = fields.getTextInputValue(customId);
    const welcomeMessage = components[0].components[1].components[0].data;

    welcomeMessage.content = `- Welcome message:\n${input.slice(0, 3000)}`;

    await serverProfile
      .findOneAndUpdate({ guildID }, { $set: { 'setup.welcome.message': input.slice(0, 3000) } })
      .catch(console.error);

    return await interaction.update({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components });
  },
};
