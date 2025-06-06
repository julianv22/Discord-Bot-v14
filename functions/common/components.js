const { ActionRowBuilder, ButtonBuilder, TextInputBuilder, ComponentType, ButtonStyle } = require('discord.js');
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
    // Return TextInputBuilder options
    [ComponentType.TextInput]: () => {
      return options.map((opt) => {
        const textinput = new TextInputBuilder().setCustomId(opt.customId).setLabel(opt.label).style(opt.style);
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
/**
 * Disable Buttons
 * @param {ActionRowBuilder} buttons - Buttons
 * @returns {ActionRowBuilder} - Return a new ActionRowBuilder with disabled buttons
 */
function disableButtons(buttons) {
  const disableRow = new ActionRowBuilder();
  for (const button of buttons) {
    for (const component of button.components) {
      const btn = ButtonBuilder.from(component);
      btn.setDisabled(true);
      disableRow.addComponents(btn);
    }
  }
  return disableRow;
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
/**
 * Info Buttons
 * @returns {ActionRowBuilder} - Return a new ActionRowBuilder with info buttons
 */
function infoButtons() {
  const buttons = [
    { customId: 'support-btn:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
    { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
    { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
    { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
  ];
  return new ActionRowBuilder().addComponents(setRowComponent(buttons, ComponentType.Button));
}
module.exports = { setRowComponent, setTextInput, disableButtons, infoButtons };
