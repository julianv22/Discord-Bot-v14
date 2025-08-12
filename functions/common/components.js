const {
  ButtonInteraction,
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
  SeparatorBuilder,
  TextInputStyle,
  ComponentType,
  ButtonStyle,
  ChannelType,
  Colors,
} = require('discord.js');
const { logError } = require('./logging');

module.exports = {
  /** Creates an action row with predefined informational buttons.
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
  /** Creates a dashboard menu for setting up various bot features.
   * @param {string} selected Selected menu value */
  dashboardMenu: (selected) => {
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

    menus.map((menu) => (menu.default = menu.value === selected));

    return new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addTextDisplayComponents(module.exports.textDisplay('### \\🛠️ Setup Dashboard'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(module.exports.rowComponents(ComponentType.StringSelect, menus));
  },
  /** Creates embed buttons.
   * @param {string} [messageId] Message ID if editing an embed.
   * @returns {ActionRowBuilder<ButtonBuilder[]>[]} */
  manageEmbedButtons: (messageId) => {
    const buttons = [
      [
        { customId: `manage-message:title:${messageId}`, label: '💬 Title', style: ButtonStyle.Primary },
        { customId: `manage-message:description:${messageId}`, label: '💬 Description', style: ButtonStyle.Primary },
        { customId: `manage-message:color:${messageId}`, label: '🎨 Color', style: ButtonStyle.Primary },
        { customId: `manage-message:author:${messageId}`, label: '✍ Author', style: ButtonStyle.Secondary },
        { customId: `manage-message:footer:${messageId}`, label: '📝 Footer', style: ButtonStyle.Secondary },
      ],
      [
        { customId: `manage-message:timestamp:${messageId}`, label: '⛔ Timestamp', style: ButtonStyle.Danger },
        { customId: `manage-message:thumbnail:${messageId}`, label: '🖼️ Thumbnail', style: ButtonStyle.Secondary },
        { customId: `manage-message:image:${messageId}`, label: '🖼️ Image', style: ButtonStyle.Secondary },
      ],
      [
        { customId: `manage-message:addfield:${messageId}`, label: '➕ Add Field', style: ButtonStyle.Success },
        {
          customId: `manage-message:removefields:${messageId}`,
          label: '➖ Remove all fields',
          style: ButtonStyle.Danger,
        },
        { customId: `manage-message:send:${messageId}`, label: '✅ Send Embed', style: ButtonStyle.Success },
      ],
    ];

    return buttons.map((button) =>
      new ActionRowBuilder().setComponents(module.exports.rowComponents(ComponentType.Button, button))
    );
  },
  /**
   * @typedef {object} ComponentOptions Configuration for various Discord components.
   * @property {string} [customId] The custom ID for the component.
   * @property {boolean} [disabled = false] Whether the component is disabled.
   * @property {string} [url] A URL for link-style buttons.
   * @property {number} [style = TextInputStyle.Short] The visual style of the component (e.g., ButtonStyle.Primary, TextInputStyle.Short).
   * @property {string} label The text displayed on the component.
   * @property {string} [value] The value associated with the component (used in StringSelect options and TextInput).
   * @property {string} [emoji] An emoji to display on the component (used in Buttons and StringSelect options).
   * @property {string} [description] A description for the component (used in StringSelect options).
   * @property {string} [placeholder] Placeholder text for components (used in StringSelect options and TextInput).
   * @property {boolean} [default] Whether this option is selected by default (used in StringSelect options).
   * @property {boolean} [required = false] Whether the component is required (used in TextInput).
   * @property {number} [maxLength] The maximum number of characters that can be entered (used in TextInput).
   * @property {number} [minLength] The minimum number of characters that can be entered (used in TextInput).
   * @property {number} [maxValues = 1] The maximum amount of options that can be selected (used in StringSelect options).
   * @property {number} [minValues = 1] The minimum amount of options that must be selected (used in StringSelect options). */

  /** Creates an array of components suitable for an ActionRow based on the specified type and options.
   * @param {ComponentType} type The type of component to create (Button, StringSelect, TextInput).
   * @param {ComponentOptions|ComponentOptions[]} options An object or array of objects defining the component properties.
   * @param {ChannelType} [channelType =  ChannelType.GuildText] The type of channel to filter by (used in ChannelSelect).
   * @returns {ButtonBuilder[]|TextInputBuilder[]|ActionRowBuilder} */
  rowComponents: (type, options, channelType = ChannelType.GuildText) => {
    options = [].concat(options); // Convert options to an array

    const setComponents = {
      [ComponentType.Button]: () => options.map((option) => new ButtonBuilder(option)),
      [ComponentType.TextInput]: () =>
        options.map((option) => new TextInputBuilder({ style: TextInputStyle.Short, required: false, ...option })),
      [ComponentType.RoleSelect]: () =>
        new ActionRowBuilder().setComponents(options.map((option) => new RoleSelectMenuBuilder(option))),
      [ComponentType.ChannelSelect]: () =>
        new ActionRowBuilder().setComponents(
          options.map((option) => new ChannelSelectMenuBuilder(option).addChannelTypes(channelType))
        ),
      [ComponentType.StringSelect]: () =>
        new ActionRowBuilder().setComponents(new StringSelectMenuBuilder(options[0]).setOptions(options.slice(1))),
    };

    if (!setComponents[type]) throw new Error(chalk.yellow('Invalid ComponentType'), chalk.green(type));

    return setComponents[type]();
  },
  /** Creates and displays a Discord Modal for user input.
   * @param {ButtonInteraction} interaction The Discord ButtonInteraction object that triggered the modal.
   * @param {string} customId The custom ID for the Modal.
   * @param {string} title The title of the Modal.
   * @param {ComponentOptions|ComponentOptions[]} options An object or array of objects defining the TextInputBuilder components for the modal. */
  createModal: async (interaction, customId, title, options) => {
    try {
      const textInputs = module.exports.rowComponents(ComponentType.TextInput, options);
      const actionRows = textInputs.map((textInput) => new ActionRowBuilder().setComponents(textInput));
      const modal = new ModalBuilder().setCustomId(customId).setTitle(title);

      for (const row of actionRows) modal.addComponents(row);
      await interaction.showModal(modal);
    } catch (e) {
      logError({ item: 'createModal', desc: 'function' }, e);
    }
  },
  /** Creates a SectionBuilder component.
   * @param {string|string[]} contents The text content for the TextDisplay components within the section (maximum 3).
   * @param {string|ComponentOptions} option An URL string for Thumbnail Accessory or ComponentOptions for Button Accessory.
   * @param {ComponentType} [accessoryType = ComponentType.Button] The type of accessory to include in the section.
   * @returns {SectionBuilder} A SectionBuilder include Thumbnail or Button accessory */
  sectionComponents: (contents, option, accessoryType = ComponentType.Button) => {
    const textDisplays = module.exports.textDisplay(contents);

    const setAccessory = {
      [ComponentType.Button]: () =>
        new SectionBuilder()
          .addTextDisplayComponents(textDisplays)
          .setButtonAccessory(module.exports.rowComponents(ComponentType.Button, option)[0]),
      [ComponentType.Thumbnail]: () =>
        new SectionBuilder()
          .addTextDisplayComponents(textDisplays)
          .setThumbnailAccessory(new ThumbnailBuilder().setURL(option.checkURL() ? option : cfg.infoPNG)),
    };

    if (!setAccessory[accessoryType])
      throw new Error(chalk.yellow('Invalid AccessoryType'), chalk.green(accessoryType));

    return setAccessory[accessoryType]();
  },
  /** Creates an array of TextDisplayBuilder components from the given content.
   * @param {string|string[]} contents The text content for the display component(s). Can be a single string or an array of strings. */
  textDisplay: (contents) => [].concat(contents).map((content) => new TextDisplayBuilder().setContent(content)),
  /** Creates a Link Button from given url
   * @param {string} url The URL of button.
   * @param {string} [label = '🔗 Jump to message'] The text displayed on the button. */
  linkButton: (url, label = '🔗 Jump to message') =>
    new ActionRowBuilder().setComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(label).setURL(url)),
};
