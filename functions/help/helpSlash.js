const { readdirSync } = require('fs');
const { StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
/**
 * Hiển thị danh sách command prefix.
 * @param {Interaction} interaction - Đối tượng interaction.
 * @param {Client} client - Đối tượng client.
 */
module.exports = (client) => {
  client.helpSlash = async (interaction) => {
    const folders = readdirSync('./slashcommands').filter((f) => f !== 'context menu' && !f.endsWith('.js'));
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`slash-menu:${folders}`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions({
        emoji: { name: `🗯` },
        label: `Prefix Commands [${client.prefixCommands.size}]`,
        value: 'prefix',
        description: `List Prefix (${cfg.prefix}) Commands`,
      })
      .addOptions(folders.map((f) => ({ emoji: { name: `📂` }, label: `${f.toUpperCase()}`, value: f })));

    const buttons = [
      { customId: 'support-btn:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    return interaction.update({
      embeds: [
        {
          author: { name: `Select Slash Command Category!`, iconURL: cfg.helpPNG },
          color: Math.floor(Math.random() * 0xffffff),
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(menu),
        new ActionRowBuilder().addComponents(
          buttons.map((data) => {
            const button = new ButtonBuilder().setLabel(data.label).setStyle(data.style);
            if (data.customId) button.setCustomId(data.customId);
            if (data.url) button.setURL(data.url);
            return button;
          }),
        ),
      ],
    });
  };
};
