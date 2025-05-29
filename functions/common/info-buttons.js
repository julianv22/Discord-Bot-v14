const { ActionRowBuilder, ComponentType, ButtonStyle, ButtonBuilder } = require('discord.js');
const { setRowComponent } = require('./components');
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
module.exports = { infoButtons, disableButtons };
