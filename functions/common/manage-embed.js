const { ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { rowComponents } = require('./components');

module.exports = {
  /** - Creates embed buttons.
   * @param {string} [messageId] - Message ID if editing an embed. */
  manageEmbedButtons: (messageId) => {
    const buttons = [
      [
        { customId: `manage-embed:title:${messageId}`, label: '💬 Title', style: ButtonStyle.Primary },
        { customId: `manage-embed:description:${messageId}`, label: '💬 Description', style: ButtonStyle.Primary },
        { customId: `manage-embed:color:${messageId}`, label: '🎨 Color', style: ButtonStyle.Primary },
        { customId: `manage-embed:author:${messageId}`, label: '✍ Author', style: ButtonStyle.Secondary },
        { customId: `manage-embed:footer:${messageId}`, label: '📝 Footer', style: ButtonStyle.Secondary },
      ],
      [
        { customId: `manage-embed:timestamp:${messageId}`, label: '⛔ Timestamp', style: ButtonStyle.Danger },
        { customId: `manage-embed:thumbnail:${messageId}`, label: '🖼️ Thumbnail', style: ButtonStyle.Secondary },
        { customId: `manage-embed:image:${messageId}`, label: '🖼️ Image', style: ButtonStyle.Secondary },
      ],
      [
        { customId: `manage-embed:addfield:${messageId}`, label: '➕ Add Field', style: ButtonStyle.Success },
        {
          customId: `manage-embed:removefields:${messageId}`,
          label: '➖ Remove all fields',
          style: ButtonStyle.Danger,
        },
        { customId: `manage-embed:send:${messageId}`, label: '✅ Send Embed', style: ButtonStyle.Success },
      ],
    ];

    /** @param {number} index - Index of buttons */
    const row = (index) =>
      new ActionRowBuilder().setComponents(rowComponents(ComponentType.Button, buttons[index - 1]));

    return [row(1), row(2), row(3)];
  },
  /** - Create reaction buttons */
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
