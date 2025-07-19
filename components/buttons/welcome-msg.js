const { Client, Interaction, TextInputStyle } = require('discord.js');
const { createModal } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'welcome-msg' },
  /** - Welcome message button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId } = interaction;

    createModal(interaction, customId, 'Welcome message', {
      customId,
      label: 'Enter the welcome message',
      style: TextInputStyle.Paragraph,
      required: true,
    });
  },
};
