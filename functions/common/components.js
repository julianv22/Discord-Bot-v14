const {
  ActionRowBuilder,
  ButtonBuilder,
  TextInputBuilder,
  ButtonComponent,
  TextInputStyle,
  ComponentType,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  /** - Set Row Component
   * @param {object[]} options - Options
   * @param {string} [options.customId] - Component customId
   * @param {string} options.label - Component label
   * @param {number} [options.style] - Component style
   * @param {string} [options.value] - Component value
   * @param {string} [options.placeholder] - Component placeholder
   * @param {string} [options.value] - Component value
   * @param {string} [options.emoji] - Component emoji
   * @param {string} [options.url] - Component url
   * @param {boolean} [options.disabled] - Component disabled
   * @param {boolean} [options.default] - Component default
   * @param {boolean} [options.required] - Component require
   * @param {number} [options.minLength] - Component minLength
   * @param {number} [options.maxLength] - Component maxLength
   * @param {ComponentType} type - Component type (Button, StringSelect, TextInput) */
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
          const options = {
            label: opt.label,
            value: opt.value,
          };

          if (opt.description) options.description = opt.description;
          if (opt.emoji) options.emoji = opt.emoji;
          if (opt.default) options.default = opt.default;

          return options;
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
  /** @param {ButtonComponent} buttons Disable Buttons */
  disableButtons: (buttons) => {
    const disableRow = new ActionRowBuilder();
    for (const button of buttons) {
      for (const component of button.components) {
        const btn = ButtonBuilder.from(component);
        btn.setDisabled(true);
        disableRow.addComponents(btn);
      }
    }

    return disableRow;
  },
  /** Create info buttons */
  infoButtons: () => {
    const buttons = [
      { customId: 'support:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    return new ActionRowBuilder().addComponents(module.exports.rowComponents(buttons, ComponentType.Button));
  },
};
