const { readdirSync } = require('fs');
const {
  Client,
  Interaction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');
const { setRowComponent } = require('../../functions/common/components');
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Commands List'),
  category: 'help',
  scooldown: 0,
  /**
   * Show command list
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { prefixCommands, slashCommands, subCommands } = client;
    const folders = readdirSync('./slashcommands').filter((f) => f !== 'context menu' && !f.endsWith('.js'));
    const menus = [
      {
        emoji: { name: `🗯` },
        label: `Prefix Commands [${prefixCommands.size}]`,
        value: 'prefix',
        description: `List Prefix (${cfg.prefix}) Commands`,
      },
      {
        emoji: { name: `📝` },
        label: `Slash Commands [${slashCommands.size + subCommands.size}]`,
        value: 'slash',
        description: `List Slash (/) Commands`,
      },
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
          author: { name: `Select Command Category ⤵️`, iconURL: cfg.helpPNG },
          color: Math.floor(Math.random() * 0xffffff),
        },
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('help-menu')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(setRowComponent(menus, ComponentType.StringSelect))
            .addOptions(folders.map((f) => ({ label: `📂 ${f.toUpperCase()}`, value: f }))),
        ),
        new ActionRowBuilder().addComponents(setRowComponent(buttons, ComponentType.Button)),
      ],
      ephemeral: true,
    });
  },
};
