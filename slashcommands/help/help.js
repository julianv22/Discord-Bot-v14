const {
  Client,
  Interaction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Commands List'),
  category: 'help',
  scooldown: 0,
  /**
   * Show command list
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const menus = [
      {
        emoji: { name: `🗯` },
        label: `Prefix Commands`,
        value: 'prefix',
        description: `List Prefix (${cfg.prefix}) Commands`,
      },
      { emoji: { name: `📝` }, label: `Slash Commands`, value: 'slash', description: `List Slash (/) Commands` },
    ];

    const buttons = [
      { customId: 'support-btn:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    await interaction.reply({
      embeds: [
        {
          author: { name: `Select Command Type!`, iconURL: cfg.helpPNG },
          color: Math.floor(Math.random() * 0xffffff),
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
              menus.map((m) => ({ emoji: m.emoji, label: m.label, value: m.value, description: m.description })),
            ),
        ),
        new ActionRowBuilder().addComponents(
          buttons.map((data) => {
            const button = new ButtonBuilder().setLabel(data.label).setStyle(data.style);
            if (data.customId) button.setCustomId(data.customId);
            if (data.url) button.setURL(data.url);
            return button;
          }),
        ),
      ],
      ephemeral: true,
    });
  },
};
