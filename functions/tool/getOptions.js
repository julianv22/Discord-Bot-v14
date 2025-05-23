const { ButtonBuilder, ComponentType } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Get components from a object.
   * @param {Object} components - Object.
   * @param {ComponentType} type - Type of components.
   * @returns {Array} - Array of components.
   */
  client.getOptions = function getOptions(components, type) {
    const getOptions = {
      // Return StringSelectMenuBuilder options
      [ComponentType.StringSelect]: () => {
        return components.map((com) => {
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
        return components.map((com) => {
          const button = new ButtonBuilder().setLabel(com.label).setStyle(com.style);
          if (com.emoji) button.setEmoji(com.emoji);
          if (com.customId) button.setCustomId(com.customId);
          if (com.url) button.setURL(com.url);
          if (com.disabled) button.setDisabled(com.disabled);
          return button;
        });
      },
    };
    if (!getOptions[type]) throw new Error(`Invalid component type: ${type}`);
    return getOptions[type]();
  };
};
