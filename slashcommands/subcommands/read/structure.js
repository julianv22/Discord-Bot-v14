const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { promises } = require('fs');
const path = require('path');

/** @param {Client} client Client */
module.exports = {
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('structure'),
  /** - Displays the project's folder structure.
   * @param {Interaction} interaction Interaction
   * @param {Client} client Client */
  async execute(interaction, client) {
    const { options, user } = interaction;
    const strPaht = options.getString('path');
    const root = path.resolve(__dirname, '..', '..');
    const ignorePatterns = ['node_modules', '.git', '.gitignore', '.env', 'package-lock.json'];

    /** - Checks if a file or folder name should be ignored.
     * @param {string} name The name of the file or folder.
     * @param {string[]} ignorePatterns An array of patterns to ignore. */
    const isIgnored = (name, ignorePatterns) => {
      for (const pattern of ignorePatterns) {
        // Handles basic cases:
        // 1. Exact name match
        if (name === pattern) return true;

        // 2. Pattern ending with '/' (applies only to directories)
        if (pattern.endsWith('/') && name === pattern.slice(0, -1)) return true;

        // 3. Simple wildcard '*' at the end (e.g., *.log)
        if (pattern.startsWith('*.') && name.endsWith(pattern.slice(1))) return true;

        // 4. Simple wildcard '*' at the beginning (e.g., temp*)
        if (pattern.endsWith('*') && name.startsWith(pattern.slice(0, -1))) return true;

        // 5. Checks if the directory/file name contains the pattern (may be undesirable with .gitignore)
        // if (name.includes(pattern)) {
        //     return true;
        // }
      }
      return false;
    };

    /** - Recursively builds a string representing the directory structure.
     * @param {string} dirPath The path to the directory.
     * @param {string} [indent=''] The indentation to use for the current level. */
    const directoryStructure = async (dirPath, indent = '') => {
      let structure = '';
      const files = await promises.readdir(dirPath, { withFileTypes: true });

      for (const file of files) {
        if (isIgnored(file.name, ignorePatterns)) continue;

        const fullPath = path.join(dirPath, file.name);
        const isLast = files.indexOf(file) === files.length - 1;
        const prefix = indent + (isLast ? '└── ' : '├── ');

        if (file.isDirectory()) {
          structure += `${prefix}${file.name}/`;
          // Recursively call for subdirectories
          structure += await directoryStructure(fullPath, indent + (isLast ? '    ' : '│   '));
        } else structure += `${prefix}${file.name}`;
      }
      return structure;
    };

    await interaction.deferReply({ flags: 64 });

    const structure = await directoryStructure(strPaht ? strPaht : root);

    const embeds = [
      new EmbedBuilder()
        .setColor(0xfed678)
        .setTitle(`\\📁 ${strPaht ? strPaht : 'Root'}:`)
        .setDescription(`\`\`\`\n${structure.slice(0, 4000)}\n\`\`\``)
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds, flags: 64 });

    if (structure.length > 4000)
      for (let i = 4000; i < structure.length; i += 4000) {
        const nextEmbed = EmbedBuilder.from(embed);

        nextEmbed.setDescription(`\`\`\`\n${structure.slice(i, i + 4000)}\n\`\`\``);

        await interaction.followUp({ embeds: [nextEmbed], flags: 64 });
      }
  },
};
