const {
  ActionRowBuilder,
  ButtonBuilder,
  TextInputBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputStyle,
  ComponentType,
  ButtonStyle,
  ChannelType,
} = require('discord.js');

module.exports = {
  /** - Creates an array of components for an ActionRow.
   * @param {object[]} options - An array of configuration objects for the components.
   * @param {string} [options.customId] - The custom ID for the component.
   * @param {string} options.label - The text that appears on the component.
   * @param {number} [options.style] - The style of the component (e.g., ButtonStyle.Primary, TextInputStyle.Short).
   * @param {string} [options.value] - The value for the component (used in StringSelect options and TextInput).
   * @param {string} [options.placeholder] - Placeholder text for the component (used in TextInput).
   * @param {string} [options.emoji] - An emoji to display on the component (used in Buttons and StringSelect options).
   * @param {string} [options.url] - A URL for link-style buttons.
   * @param {boolean} [options.disabled=false] - Whether the component is disabled.
   * @param {boolean} [options.default] - Whether this option is selected by default (used in StringSelect options).
   * @param {boolean} [options.required=false] - Whether the component is required (used in TextInput).
   * @param {number} [options.minLength] - The minimum input length (used in TextInput).
   * @param {number} [options.maxLength] - The maximum input length (used in TextInput).
   * @param {ComponentType} type - The type of component to create (Button, StringSelect, TextInput).
   * @returns {ButtonBuilder[]|StringSelectMenuOptionBuilder[]|TextInputBuilder[]} An array of the created components. */
  rowComponents: (options, type) => {
    const rowComponents = {
      // Return ButtonBuilder options
      [ComponentType.Button]: () => {
        return options.map((opt) => {
          const button = new ButtonBuilder()
            .setLabel(opt.label)
            .setStyle(opt.style)
            .setDisabled(opt.disabled ?? false);

          if (opt.emoji) button.setEmoji(opt.emoji);
          if (opt.customId) button.setCustomId(opt.customId);
          if (opt.url) button.setURL(opt.url);

          return button;
        });
      },
      // Return StringSelectMenuBuilder options
      [ComponentType.StringSelect]: () => {
        return options.map((opt) => {
          const option = new StringSelectMenuOptionBuilder().setLabel(opt.label).setValue(opt.value);

          if (opt.description) option.setDescription(opt.description);
          if (opt.emoji) option.setEmoji(opt.emoji);
          if (opt.default) option.setDefault(opt.default);

          return option;
        });
      },
      // Return TextInputBuilder options
      [ComponentType.TextInput]: () => {
        return options.map((opt) => {
          const textinput = new TextInputBuilder()
            .setCustomId(opt.customId)
            .setLabel(opt.label)
            .setStyle(opt.style || TextInputStyle.Short)
            .setRequired(opt.required ?? false);

          if (opt.value) textinput.setValue(opt.value);
          if (opt.placeholder) textinput.setPlaceholder(opt.placeholder);
          if (opt.minLength) textinput.setMinLength(opt.minLength);
          if (opt.maxLength) textinput.setMaxLength(opt.maxLength);

          return textinput;
        });
      },
    };

    if (!rowComponents[type]) throw new Error(chalk.yellow('Invalid ComponentType ') + chalk.green(type));

    return rowComponents[type]();
  },
  /** - Disables all buttons within a set of action rows, returning them in a single new action row.
   * @param {ActionRowBuilder<ButtonBuilder>[]} actionRows - An array of action rows containing the buttons to disable. */
  disableButtons: (actionRows) => {
    const disableRow = new ActionRowBuilder();
    for (const row of actionRows) {
      for (const component of row.components) {
        const btn = ButtonBuilder.from(component).setDisabled(true);
        disableRow.addComponents(btn);
      }
    }
    return disableRow;
  },
  /** - Creates an action row with predefined informational buttons. */
  infoButtons: () => {
    const buttons = [
      { customId: 'support:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    return new ActionRowBuilder().addComponents(module.exports.rowComponents(buttons, ComponentType.Button));
  },
  /** - Creates a SectionBuilder component, typically for a StringSelectMenu.
   * @param {string|string[]} textContents - An array of strings for the TextDisplay components within the section (max 3).
   * @param {ComponentType.Thumbnail | ComponentType.Button} accessoryType - The type of accessory for the section.
   * @param {string|object} [options] */
  sectionComponents: (textContents, accessoryType, options) => {
    const contents = Array.isArray(textContents) ? textContents : [textContents];
    const { iconURL, customId, label, style } = options;

    if (contents.length > 3) return null;

    const sectionComponents = new SectionBuilder();

    switch (accessoryType) {
      case ComponentType.Thumbnail:
        sectionComponents.setThumbnailAccessory(new ThumbnailBuilder().setURL(iconURL || cfg.infoPNG));
        break;
      case ComponentType.Button:
        sectionComponents.setButtonAccessory(new ButtonBuilder().setCustomId(customId).setLabel(label).setStyle(style));
        break;
      default:
        return null;
    }

    for (const content of contents) {
      sectionComponents.addTextDisplayComponents(module.exports.textDisplay(content));
    }

    return sectionComponents;
  },
  /** - Creates an ActionRowBuilder containing a select menu.
   * @param {string} customId - The custom ID for the select menu.
   * @param {ChannelType | ChannelType[] | ComponentType.RoleSelect} [type=ChannelType.GuildText] - The type of menu. Can be a single ChannelType, an array of ChannelTypes, or ComponentType.RoleSelect. */
  menuComponents: (customId, type = ChannelType.GuildText) => {
    const actionRow = new ActionRowBuilder();

    switch (type) {
      case ComponentType.RoleSelect:
        actionRow.setComponents(new RoleSelectMenuBuilder().setCustomId(customId).setMinValues(1).setMaxValues(1));
        break;

      default: // Handles single ChannelType, array of ChannelTypes, etc.
        actionRow.setComponents(
          new ChannelSelectMenuBuilder().setCustomId(customId).setChannelTypes(type).setMinValues(1).setMaxValues(1)
        );
        break;
    }
    return actionRow;
  },
  /** @param {string} content - The text content for the display component. */
  textDisplay: (content) => new TextDisplayBuilder().setContent(content),
};
