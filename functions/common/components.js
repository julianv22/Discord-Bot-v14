const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, ButtonBuilder } = require('discord.js');
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
      return options.map((opt) => {
        const option = {
          label: opt.label ?? '',
          value: opt.value ?? '',
        };
        if (opt.description) option.description = opt.description;
        if (opt.emoji) option.emoji = opt.emoji;
        if (opt.default) option.default = opt.default;
        return option;
      });
    },
    // Return ButtonBuilder options
    [ComponentType.Button]: () => {
      return options.map((opt) => {
        const button = new ButtonBuilder().setLabel(opt.label).setStyle(opt.style);
        if (opt.emoji) button.setEmoji(opt.emoji);
        if (opt.customId) button.setCustomId(opt.customId);
        if (opt.url) button.setURL(opt.url);
        if (opt.disabled) button.setDisabled(opt.disabled);
        return button;
      });
    },
    [ComponentType.TextInput]: () => {
      return options.map((opt) => {
        const textinput = new TextInputBuilder().setCustomId(opt.id).setLabel(opt.lablel).style(opt.style);
        if (opt.placeholder) textinput.setPlaceholder(opt.placeholder);
        if (opt.required) textinput.setRequired(opt.required);
        if (opt.minLength) textinput.setMinLength(opt.minLength);
        if (opt.maxLength) textinput.setMaxLength(opt.maxLength);
        return textinput;
      });
    },
  };
  if (!setRowComponent[type]) throw new Error(`Invalid component type: ${type}`);
  return setRowComponent[type]();
}
module.exports = { setRowComponent };
