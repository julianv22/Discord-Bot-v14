const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { rowComponents } = require('./components');

module.exports = {
  /** - Creates embed buttons.
   * @param {string} [messageId] - Message ID if editing an embed.
   * @returns {ActionRowBuilder<ButtonBuilder[]>} */
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

    /** @param {number} index - Index of buttons */
    const row = (index) =>
      new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons[index - 1]));

    return [row(1), row(2), row(3)];
  },
  /** - Create reaction buttons
   * @returns {ActionRowBuilder<ButtonBuilder[]>} */
  reactionButtons: () => {
    const button = [
      { customId: 'reaction-role:hide', label: '⛔ Hide guide', style: ButtonStyle.Danger },
      { customId: 'reaction-role:title', label: '💬 Title', style: ButtonStyle.Primary },
      { customId: 'reaction-role:color', label: '🎨 Color', style: ButtonStyle.Secondary },
      { customId: 'reaction-role:add', label: '➕ Add Role', style: ButtonStyle.Success },
      { customId: 'reaction-role:finish', label: '✅ Finish', style: ButtonStyle.Success },
    ];
    return new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, button));
  },
};
