const {
  Client,
  Interaction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
} = require('discord.js');
const { rowComponents, infoButtons } = require('../../functions/common/components');

module.exports = {
  category: 'info',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('help').setDescription('Command help'),
  /** - Command help
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
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

    const ignore = 'context menu';
    const slashCategories = new Set(
      slashCommands.filter((cmd) => !ignore.includes(cmd.category)).map((cmd) => cmd.category)
    );

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
            .setOptions(rowComponents(menus, ComponentType.StringSelect))
            .addOptions(Array.from(slashCategories).map((value) => ({ label: `📂 ${value.toCapitalize()}`, value })))
        ),
        infoButtons(),
      ],
      flags: 64,
    });
  },
};
