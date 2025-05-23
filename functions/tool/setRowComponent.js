const { Client, ButtonBuilder, ComponentType } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Get components from a object.
   * @param {Object} options - Object.
   * @param {ComponentType} type - Type of components.
   * @returns {Array} - Array of components.
   */
  client.setRowComponent = function setRowComponent(options, type) {
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
  };
};
