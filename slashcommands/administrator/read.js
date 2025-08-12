const {
  Client,
  Interaction,
  SlashCommandBuilder,
  ContainerBuilder,
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
  PermissionFlagsBits,
  Colors,
} = require('discord.js');
const { readFiles } = require('../../functions/common/initLoader');
const { textDisplay, rowComponents } = require('../../functions/common/components');
const profiles = readFiles('config', { filter: (file) => file.endsWith('Profile.js') });

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('read')
    .setDescription(`Reads content from JavaScript files, MongoDB, or project structure. ${cfg.adminRole} only`)
    .addSubcommand((sub) =>
      sub
        .setName('file')
        .setDescription(`Reads the content of a JavaScript file. ${cfg.adminRole} only`)
        .addStringOption((option) =>
          option
            .setName('filepath')
            .setDescription('The relative path to the JavaScript file (e.g., ./commands/ping.js).')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('database')
        .setDescription('Reads data from a MongoDB database. ⭕wner only')
        .addStringOption((opt) =>
          opt
            .setName('profile')
            .setDescription(`Choose which profile type to query from the database. ${cfg.adminRole} only`)
            .setRequired(true)
            .addChoices(profiles.map((p) => ({ name: p.split('.')[0], value: p.split('.')[0] })))
            .addChoices({ name: 'reactionRole', value: 'reactionRole' })
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('structure')
        .setDescription(`Reads the project structure from a specified path. ${cfg.adminRole} only`)
    ),
  /** Reads file content, MongoDB data, or project structure
   * @param {Interaction} interaction Interaction
   * @param {Client} client Client */
  async execute(interaction, client) {
    const { options } = interaction;
    const subCommand = options.getSubcommand();

    if (subCommand === 'structure') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const ignorePatterns = ['node_modules', '.git', '.gitignore', '.env', 'package-lock.json'];
      const srcFolders = readFiles(process.cwd(), {
        isDir: true,
        filter: (folder) => !ignorePatterns.includes(folder),
      });

      const menus = [
        { customId: 'structure-menu:main', placeholder: '⚙️ Select folder to display structure' },
        { emoji: '📂', label: 'Root', value: process.cwd(), description: 'Root Directory' },
        ...srcFolders.map((folder) => ({ label: ` └──📂 ${folder.toCapitalize()}`, value: folder })),
      ];

      const container = new ContainerBuilder()
        .setAccentColor(Colors.DarkGreen)
        .addTextDisplayComponents(textDisplay("### \\📂 Displays the project's folder structure."))
        .addActionRowComponents(rowComponents(ComponentType.StringSelect, menus));

      await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
  },
};
