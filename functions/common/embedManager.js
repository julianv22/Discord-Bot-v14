const {
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ComponentType,
} = require('discord.js');
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
    'Random',
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
 * @returns {[ActionRowBuilder, ActionRowBuilder]} - Return ActionRowBuilder
 */
function manageEmbedButtons() {
  const button1 = [
    { customId: 'manage-embed-btn:title', label: '💬Title', style: ButtonStyle.Primary },
    { customId: 'manage-embed-btn:description', label: '💬Description', style: ButtonStyle.Primary },
    { customId: 'manage-embed-btn:color', label: '🎨Color', style: ButtonStyle.Primary },
    { customId: 'manage-embed-btn:thumbnail', label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
    { customId: 'manage-embed-btn:image', label: '🖼️Image', style: ButtonStyle.Secondary },
  ];
  const button2 = [
    { customId: 'manage-embed-btn:footer', label: '⛔DisableFooter', style: ButtonStyle.Danger },
    { customId: 'manage-embed-btn:timestamp', label: '⛔Disable Timestamp', style: ButtonStyle.Danger },
    { customId: 'manage-embed-btn:send', label: '✅Send Embed', style: ButtonStyle.Success },
  ];
  return [
    new ActionRowBuilder().addComponents(setRowComponent(button1, ComponentType.Button)),
    new ActionRowBuilder().addComponents(setRowComponent(button2, ComponentType.Button)),
  ];
}
/**
 * Create modal
 * @param {string} customId - Modal custom ID
 * @param {string} title - Modal title
 * @param {Object} textOptions - Modal Components
 * @returns {ModalBuilder} - Return ModalBuilder
 */
function createModal(customId, title, textOptions) {
  return (modal = new ModalBuilder().setCustomId(customId).setTitle(title)).addComponents(setEmbedInput(textOptions));
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
function setEmbedInput({ id, label, style = TextInputStyle.Short, placeholder = '', required = false }) {
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
module.exports = { getEmbedColor, manageEmbedButtons, createModal, setEmbedInput };
