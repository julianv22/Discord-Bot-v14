const { Client, ButtonInteraction, ModalBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'youtube' },
  /** - YouTube Subscribe Channels
   * @param {ButtonInteraction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId } = interaction;
    const [, action] = customId.split(':');

    const textInput = [
      {
        customId: action,
        label: 'YouTube ChannelID',
        placeholder: 'Enter the YouTube ChannelID',
        required: true,
      },
    ];

    const modal = new ModalBuilder()
      .setCustomId(customId)
      .setTitle(`${action.toCapitalize()} YouTube Channel`)
      .setComponents(new ActionRowBuilder().setComponents(rowComponents(textInput, ComponentType.TextInput)));

    await interaction.showModal(modal);
  },
};
