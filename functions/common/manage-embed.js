const { ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { rowComponents } = require('./components');

module.exports = {
  /** - Create embed buttons
   * @param {string} messageId - Message ID if edit embed */
  embedButtons: (messageId) => {
    const button1 = [
        { customId: `manage-embed:title:${messageId}`, label: '💬Title', style: ButtonStyle.Primary },
        { customId: `manage-embed:description:${messageId}`, label: '💬Description', style: ButtonStyle.Primary },
        { customId: `manage-embed:color:${messageId}`, label: '🎨Color', style: ButtonStyle.Primary },
        { customId: `manage-embed:author:${messageId}`, label: '✍Author', style: ButtonStyle.Secondary },
        { customId: `manage-embed:footer:${messageId}`, label: '📝Footer', style: ButtonStyle.Secondary },
      ],
      button2 = [
        { customId: `manage-embed:thumbnail:${messageId}`, label: '🖼️Thumbnail', style: ButtonStyle.Secondary },
        { customId: `manage-embed:image:${messageId}`, label: '🖼️Image', style: ButtonStyle.Secondary },
        { customId: `manage-embed:timestamp:${messageId}`, label: '⛔Timestamp', style: ButtonStyle.Danger },
        { customId: `manage-embed:send:${messageId}`, label: '✅Send Embed', style: ButtonStyle.Success },
      ];
    return [
      new ActionRowBuilder().addComponents(rowComponents(button1, ComponentType.Button)),
      new ActionRowBuilder().addComponents(rowComponents(button2, ComponentType.Button)),
    ];
  },
  /** - Create reaction buttons */
  reactionButtons: () => {
    const button1 = [
      { customId: 'reaction-role:title', label: '💬Title', style: ButtonStyle.Primary },
      { customId: 'reaction-role:color', label: '🎨Color', style: ButtonStyle.Secondary },
      { customId: 'reaction-role:add', label: '➕Add Role', style: ButtonStyle.Primary },
      { customId: 'reaction-role:finish', label: '✅Finish', style: ButtonStyle.Success },
      // { customId: 'reaction-role:cancel', label: '❌Cancel', style: ButtonStyle.Danger },
    ];
    return new ActionRowBuilder().addComponents(rowComponents(button1, ComponentType.Button));
  },
};
