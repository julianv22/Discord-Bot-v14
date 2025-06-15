const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require('discord.js');
const { setRowComponent, infoButtons } = require('../../functions/common/components');
const { capitalize } = require('../../functions/common/utilities');
const { readFiles } = require('../../functions/common/initLoader');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('help').setDescription('Commands List'),
  /**
   * Show command list
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { prefixCommands, slashCommands, subCommands } = client;
    let menus = [
      {
        emoji: { name: '📋' },
        label: `Prefix Commands [${prefixCommands.size}]`,
        value: 'prefix',
        description: `List Prefix (${prefix}) Commands`,
      },
      {
        emoji: { name: '📝' },
        label: `Slash Commands [${slashCommands.size + subCommands.size}]`,
        value: 'slash',
        description: 'List Slash (/) Commands',
      },
    ];

    const ignoreFolders = ['context menu'];
    const slashFolders = readFiles('slashcommands', {
      isDir: true,
      filter: (folder) => !ignoreFolders.includes(folder),
    });
    await interaction.reply({
      embeds: [
        {
          author: { name: 'Select Command Category ⤵️', iconURL: cfg.helpPNG },
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
            .addOptions(slashFolders.map((folder) => ({ label: `📂 ${capitalize(folder)}`, value: folder }))),
        ),
        infoButtons(),
      ],
      flags: 64,
    });
  },
};
