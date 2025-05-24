const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, ButtonBuilder } = require('discord.js');
/**
 * Set Text Input Component
 * @param {Object} options - Options object
 * @param {string} options.id - The id of the text input
 * @param {string} options.label - The label of the text input
 * @param {string} options.style - The style of the text input
 * @param {string} options.placeholder - The placeholder of the text input
 * @param {boolean} options.required - Whether the text input is required
 * @returns {ActionRowBuilder} - Return ActionRowBuilder
 */
function setTextInputComponent({ id, label, style = TextInputStyle.Short, placeholder = '', required = false }) {
  return new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setValue('')
      .setStyle(style)
      .setPlaceholder(placeholder)
      .setRequired(required),
  );
}
/**
 * Set Row Component
 * @param {Object} options - Options object
 * @param {ComponentType} type - Component type
 * @returns {ActionRowBuilder} - Return ActionRowBuilder
 */
function setRowComponent(options, type) {
  const setRowComponent = {
    // Return StringSelectMenuBuilder options
    [ComponentType.StringSelect]: () => {
      return options.map((com) => {
        const options = {
          label: com.label ?? '',
          value: com.value ?? '',
        };
        if (com.description) options.description = com.description;
        if (com.emoji) options.emoji = com.emoji;
        if (com.default) options.default = com.default;
        return options;
      });
    },
    // Return ButtonBuilder options
    [ComponentType.Button]: () => {
      return options.map((com) => {
        const button = new ButtonBuilder().setLabel(com.label).setStyle(com.style);
        if (com.emoji) button.setEmoji(com.emoji);
        if (com.customId) button.setCustomId(com.customId);
        if (com.url) button.setURL(com.url);
        if (com.disabled) button.setDisabled(com.disabled);
        return button;
      });
    },
  };
  if (!setRowComponent[type]) throw new Error(`Invalid component type: ${type}`);
  return setRowComponent[type]();
}
module.exports = { setTextInputComponent, setRowComponent };
