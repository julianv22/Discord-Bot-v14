const { Client, Interaction, ModalBuilder, ActionRowBuilder, ComponentType, TextInputStyle } = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'welcome-msg' },
  /** - Welcome message button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId } = interaction;
    const textinput = new ActionRowBuilder().setComponents(
      rowComponents(
        [{ customId, label: 'Enter the welcome message', style: TextInputStyle.Paragraph, required: true }],
        ComponentType.TextInput
      )
    );
    const modal = new ModalBuilder().setCustomId(customId).setTitle('Welcome message').setComponents(textinput);

    await interaction.showModal(modal);
  },
};
