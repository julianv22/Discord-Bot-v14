const {
  ButtonInteraction,
  ModalSubmitInteraction,
  ContainerBuilder,
  ActionRowBuilder,
  ModalBuilder,
  ButtonBuilder,
  TextInputBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  RoleSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SeparatorBuilder,
  TextInputStyle,
  ComponentType,
  ButtonStyle,
  ChannelType,
  Colors,
} = require('discord.js');

module.exports = {
  /** - Creates an action row with predefined informational buttons.
   * @returns {ActionRowBuilder<ButtonBuilder[]>} An ActionRowBuilder containing the informational buttons. */
  infoButtons: () => {
    const buttons = [
      { customId: 'support:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    return new ActionRowBuilder().setComponents(module.exports.rowComponents(ComponentType.Button, buttons));
  },
  /** - Creates a dashboard menu for setting up various bot features. */
  dashboardMenu: () => {
    const menus = [
      { customId: 'dashboard-menu', placeholder: '⚙️ Select feature for setting' },
      {
        emoji: '👋',
        label: 'Setup Welcome',
        value: 'welcome',
        description: 'Configures the welcome message and channel.',
      },
      {
        emoji: '📊',
        label: 'Setup Statistics',
        value: 'statistics',
        description: 'Configures the server statistics display.',
      },
      {
        emoji: '⭐',
        label: 'Setup Starboard',
        value: 'starboard',
        description: 'Configures the starboard feature for starred messages.',
      },
      {
        emoji: '💡',
        label: 'Setup Suggest',
        value: 'suggest',
        description: 'Configures the suggestion submission and management system.',
      },
      {
        emoji: '⛔',
        label: 'Setup Disable',
        value: 'disable',
        description: 'Disables specific bot features for the server.',
      },
    ];

    return new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addTextDisplayComponents(module.exports.textDisplay('### \\⚒️ Setup Dashboard'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(module.exports.rowComponents(ComponentType.StringSelect, menus))
      );
  },
  /**
   * @typedef {object} ComponentOptions - Configuration for various Discord components.
   * @property {string} [customId] - The custom ID for the component.
   * @property {string} label - The text displayed on the component.
   * @property {number} [style] - The visual style of the component (e.g., ButtonStyle.Primary, TextInputStyle.Short).
   * @property {boolean} [disabled=false] - Whether the component is disabled.
   * @property {string} [url] - A URL for link-style buttons.
   * @property {string} [value] - The value associated with the component (used in StringSelect options and TextInput).
   * @property {string} [description] - A description for the component (used in StringSelect options).
   * @property {string} [emoji] - An emoji to display on the component (used in Buttons and StringSelect options).
   * @property {boolean} [default] - Whether this option is selected by default (used in StringSelect options).
   * @property {string} [placeholder] - Placeholder text for input components (used in TextInput).
   * @property {boolean} [required=false] - Whether the component is required (used in TextInput).
   * @property {number} [min_length] - The minimum input length (used in TextInput).
   * @property {number} [max_length] - The maximum input length (used in TextInput).
   */
  /** - Creates an array of components suitable for an ActionRow based on the specified type and options.
   * @param {ComponentType} type - The type of component to create (Button, StringSelect, TextInput).
   * @param {ComponentOptions|ComponentOptions[]} options - An object or array of objects defining the component properties.
   * @returns {ButtonBuilder[]|StringSelectMenuBuilder|TextInputBuilder[]} An array of the created components, or a single StringSelectMenuBuilder. */
  rowComponents: (type, options) => {
    options = [].concat(options); // Convert options to an array

    const setComponentOptions = {
      [ComponentType.Button]: () => {
        return options.map((option) => {
          const button = new ButtonBuilder()
            .setLabel(option.label)
            .setStyle(option.style)
            .setDisabled(option?.disabled || false);

          if (option?.emoji) button.setEmoji(option.emoji);
          if (option?.customId) button.setCustomId(option.customId);
          if (option?.url) button.setURL(option.url);

          return button;
        });
      },
      [ComponentType.StringSelect]: () => {
        return new StringSelectMenuBuilder()
          .setCustomId(options[0].customId)
          .setMinValues(options[0]?.min_length || 1)
          .setMaxValues(options[0]?.max_length || 1)
          .setPlaceholder(options[0]?.placeholder || 'Make a selection')
          .setOptions(
            options.slice(1).map((option, id) => {
              const optionBuilder = new StringSelectMenuOptionBuilder().setLabel(option.label).setValue(option.value);

              if (option?.description) optionBuilder.setDescription(option.description);
              if (option?.emoji) optionBuilder.setEmoji(option.emoji);
              if (option?.default) optionBuilder.setDefault(option.default);

              return optionBuilder;
            })
          );
      },
      [ComponentType.TextInput]: () => {
        return options.map((option) => {
          const textinput = new TextInputBuilder()
            .setCustomId(option.customId)
            .setLabel(option.label)
            .setStyle(option.style || TextInputStyle.Short)
            .setRequired(option?.required || false);

          if (option?.value) textinput.setValue(option.value);
          if (option?.placeholder) textinput.setPlaceholder(option.placeholder);
          if (option?.min_length) textinput.setMinLength(option.min_length);
          if (option?.max_length) textinput.setMaxLength(option.max_length);

          return textinput;
        });
      },
    };

    if (!setComponentOptions[type]) throw new Error(chalk.yellow('Invalid ComponentType'), chalk.green(type));

    return setComponentOptions[type]();
  },
  /** - Creates and displays a Discord Modal for user input.
   * @param {ButtonInteraction} interaction - The Discord ButtonInteraction object that triggered the modal.
   * @param {string} customId - The custom ID for the Modal.
   * @param {string} title - The title of the Modal.
   * @param {ComponentOptions|ComponentOptions[]} options - An object or array of objects defining the TextInputBuilder components for the modal.
   * @returns {Promise<ModalSubmitInteraction>} A promise that resolves when the modal is shown. */
  createModal: async (interaction, customId, title, options) => {
    const textInputs = module.exports.rowComponents(ComponentType.TextInput, options);
    const actionRows = textInputs.map((textInput) => new ActionRowBuilder().setComponents(textInput));
    const modal = new ModalBuilder().setCustomId(customId).setTitle(title);

    for (const row of actionRows) modal.addComponents(row);
    return await interaction.showModal(modal);
  },
  /** - Creates a SectionBuilder component, typically used within a StringSelectMenu or similar composite components.
   * @param {string|string[]} contents - The text content for the TextDisplay components within the section (maximum 3).
   * @param {ComponentType.Thumbnail|ComponentType.Button} accessoryType - The type of accessory to include in the section.
   * @param {string|ComponentOptions} [options] - If `accessoryType` is `ComponentType.Thumbnail`, this is a string URL for the thumbnail. If `accessoryType` is `ComponentType.Button`, this is a `ComponentOptions` object for the button. */
  sectionComponents: (contents, accessoryType, options) => {
    const displayContents = module.exports.textDisplay(contents);
    const sectionComponents = new SectionBuilder();

    switch (accessoryType) {
      case ComponentType.Thumbnail:
        sectionComponents
          .addTextDisplayComponents(displayContents)
          .setThumbnailAccessory(new ThumbnailBuilder().setURL(options || cfg.infoPNG));
        break;
      case ComponentType.Button:
        sectionComponents
          .addTextDisplayComponents(displayContents)
          .setButtonAccessory(module.exports.rowComponents(accessoryType, options)[0]);
        break;
    }

    return sectionComponents;
  },
  /** - Creates an ActionRowBuilder containing a select menu (ChannelSelectMenuBuilder or RoleSelectMenuBuilder).
   * @param {string} customId - The custom ID for the select menu.
   * @param {string} [placeholder='Make a selection'] - The placeholder text displayed when no option is selected.
   * @param {ChannelType|ChannelType[]|ComponentType.RoleSelect} [type=ChannelType.GuildText] - The type of select menu. Can be a single ChannelType, an array of ChannelTypes, or `ComponentType.RoleSelect`.
   * @returns {ActionRowBuilder<ChannelSelectMenuBuilder>|ActionRowBuilder<RoleSelectMenuBuilder>} An ActionRowBuilder containing the specified select menu. */
  menuComponents: (customId, placeholder = 'Make a selection', type = ChannelType.GuildText) => {
    const actionRow = new ActionRowBuilder();

    switch (type) {
      case ComponentType.RoleSelect:
        actionRow.setComponents(
          new RoleSelectMenuBuilder().setCustomId(customId).setPlaceholder(placeholder).setMinValues(1).setMaxValues(1)
        );
        break;

      default: // Handles single ChannelType, array of ChannelTypes, etc.
        actionRow.setComponents(
          new ChannelSelectMenuBuilder()
            .setCustomId(customId)
            .setChannelTypes(type)
            .setPlaceholder(placeholder)
            .setMinValues(1)
            .setMaxValues(1)
        );
        break;
    }

    return actionRow;
  },
  /** - Creates an array of TextDisplayBuilder components from the given content.
   * @param {string|string[]} contents - The text content for the display component(s). Can be a single string or an array of strings. */
  textDisplay: (contents) => [].concat(contents).map((content) => new TextDisplayBuilder().setContent(content)),
  /** - Link button
   * @param {string} url - The URL of button
   * @param {string} [label='Jump to message'] - The text displayed on the button */
  linkButton: (url, label = '🔗 Jump to message') =>
    new ActionRowBuilder().setComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(label).setURL(url)),
};
