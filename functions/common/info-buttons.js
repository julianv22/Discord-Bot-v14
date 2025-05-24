const { ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { setRowComponent } = require('./components');

function infoButtons() {
  const buttons = [
    { customId: 'support-btn:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
    { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
    { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
    { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
  ];
  return new ActionRowBuilder().addComponents(setRowComponent(buttons, ComponentType.Button));
}
module.exports = { infoButtons };
