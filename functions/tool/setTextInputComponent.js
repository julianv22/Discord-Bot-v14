const { Client } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Set Text Input Component
   * @param {Object} options - Options object
   * @param {string} options.id - The id of the text input
   * @param {string} options.label - The label of the text input
   * @param {string} options.style - The style of the text input
   * @param {string} options.placeholder - The placeholder of the text input
   * @param {boolean} options.required - Whether the text input is required
   */
  client.setTextInputComponent = function setTextInputComponent({
    id,
    label,
    style = TextInputStyle.Short,
    placeholder = '',
    required = false,
  }) {
    return new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(id)
        .setLabel(label)
        .setValue('')
        .setStyle(style)
        .setPlaceholder(placeholder)
        .setRequired(required),
    );
  };
};
