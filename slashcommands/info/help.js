const {
  Client,
  Interaction,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
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
    const ignore = 'context menu';
    const slashCategories = new Set(
      slashCommands.filter((cmd) => !ignore.includes(cmd.category)).map((cmd) => cmd.category)
    );

    const menus = [
      { customId: 'help-menu', placeholder: '📌 Select Command Type' },
      {
        emoji: { name: '📝' },
        label: `Prefix Commands [${prefixCommands.size}]`,
        value: 'prefix',
        description: `List Prefix (${prefix}) Commands`,
      },
      {
        emoji: { name: '📚' },
        label: `Slash Commands [${slashCommands.size + subCommands.size}]`,
        value: 'slash',
        description: 'List Slash (/) Commands',
      },
      ...Array.from(slashCategories).map((value) => ({ label: `📂 ${value.toCapitalize()}`, value })),
    ];

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Math.random() * 0xffffff)
          .setAuthor({ name: 'Select Command Category ⤵️', iconURL: cfg.helpPNG }),
      ],
      components: [
        new ActionRowBuilder().setComponents(rowComponents(ComponentType.StringSelect, menus)),
        infoButtons(),
      ],
      flags: 64,
    });
  },
};
