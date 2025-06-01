const { ButtonStyle, ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');
const { setRowComponent } = require('./components');
/**
 * Get embed color
 * @param {string} color - Color input
 * @returns {string} - Return valid color name. If invalid, return 'Random'
 */
function getEmbedColor(color) {
  const embedColors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'LuminousVividPink',
    'Fuchsia',
    'Gold',
    'Orange',
    'Purple',
    'DarkAqua',
    'DarkGreen',
    'DarkBlue',
    'DarkPurple',
    'DarkVividPink',
    'DarkGold',
    'DarkOrange',
    'DarkRed',
    'DarkGrey',
    'Navy',
    'Aqua',
    'Blurple',
    'Greyple',
    'DarkButNotBlack',
    'NotQuiteBlack',
    'White',
    'Default',
  ];
  /**
   * Normalize a string
   * @param {string} input - Input string
   * @returns {string} - Normalized string
   */
  function normalized(input) {
    // Remove all spaces and convert to lowercase
    return input.toLowerCase().replace(/\s/g, '');
  }
  // Check valid color name
  for (const colorName of embedColors) {
    if (normalized(colorName) === normalized(color)) return colorName;
  }
  // Return Random if invalid
  return 'Random';
}
/**
 * Create embed buttons
 * @param {string} messageId - Message ID if edit embed
 * @returns {[ActionRowBuilder, ActionRowBuilder]} - Return ActionRowBuilder
 */
function embedButtons(messageId) {
  const button1 = [
    { customId: `manage-embed-btn:title:${messageId}`, label: '💬Title', style: ButtonStyle.Primary },
    { customId: `manage-embed-btn:description:${messageId}`, label: '💬Description', style: ButtonStyle.Primary },
    { customId: `manage-embed-btn:color:${messageId}`, label: '🎨Color', style: ButtonStyle.Primary },
    { customId: `manage-embed-btn:author:${messageId}`, label: '✍Author', style: ButtonStyle.Secondary },
    { customId: `manage-embed-btn:footer:${messageId}`, label: '📝Footer', style: ButtonStyle.Secondary },
  ];
  const button2 = [
    { customId: `manage-embed-btn:thumbnail:${messageId}`, label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
    { customId: `manage-embed-btn:image:${messageId}`, label: '🖼️Image', style: ButtonStyle.Secondary },
    { customId: `manage-embed-btn:timestamp:${messageId}`, label: '⛔Timestamp', style: ButtonStyle.Danger },
    { customId: `manage-embed-btn:send:${messageId}`, label: '✅Send Embed', style: ButtonStyle.Success },
  ];
  return [
    new ActionRowBuilder().addComponents(setRowComponent(button1, ComponentType.Button)),
    new ActionRowBuilder().addComponents(setRowComponent(button2, ComponentType.Button)),
  ];
}
/**
 * Create reaction buttons
 * @returns {ActionRowBuilder} - Return ActionRowBuilder
 */
function reactionButtons() {
  const button1 = [
    { customId: 'reaction-btn:title', label: '💬Title', style: ButtonStyle.Primary },
    { customId: 'reaction-btn:color', label: '🎨Color', style: ButtonStyle.Secondary },
    { customId: 'reaction-btn:add', label: '➕Add Role', style: ButtonStyle.Primary },
    { customId: 'reaction-btn:finish', label: '✅Finish', style: ButtonStyle.Success },
    { customId: 'reaction-btn:cancel', label: '❌Cancel', style: ButtonStyle.Danger },
  ];
  return new ActionRowBuilder().addComponents(setRowComponent(button1, ComponentType.Button));
}
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
function setTextInput({ id, label, style = TextInputStyle.Short, placeholder = '', required = false }) {
  return new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId(id)
      .setLabel(label)
      .setStyle(style)
      .setPlaceholder(placeholder)
      .setRequired(required),
  );
}
module.exports = { getEmbedColor, embedButtons, reactionButtons, setTextInput };
