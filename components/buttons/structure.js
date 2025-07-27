const { Client, Interaction, EmbedBuilder } = require('discord.js');
const { promises } = require('fs');
const path = require('path');

module.exports = {
  type: 'buttons',
  data: { name: 'structure' },
  /** - Disable Features Button
   * @param {Interaction} interaction Button Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const { user, customId } = interaction;
    const [, folder] = customId.split(':');
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
          structure += `${prefix}${file.name}/\n`;
          // Recursively call for subdirectories
          structure += await directoryStructure(fullPath, indent + (isLast ? '    ' : '│   '));
        } else structure += `${prefix}${file.name}\n`;
      }
      return structure;
    };

    await interaction.deferReply({ flags: 64 });

    const structure = await directoryStructure(folder === 'root' ? process.cwd() : folder);
    const MAX_LENGTH = 3990;

    const embeds = [
      new EmbedBuilder()
        .setColor(0xfed678)
        .setTitle(`\\📁 ${folder}:`)
        .setDescription(`\`\`\`\n${structure.slice(0, MAX_LENGTH)}\n\`\`\``)
        .setFooter({
          text: `Requested by ${user.displayName || user.username}`,
          iconURL: user.displayAvatarURL(true),
        })
        .setTimestamp(),
    ];

    await interaction.editReply({ embeds, flags: 64 });

    if (structure.length > MAX_LENGTH)
      for (let i = MAX_LENGTH; i < structure.length; i += MAX_LENGTH)
        await interaction.followUp({
          embeds: [EmbedBuilder.from(embeds).setDescription(`\`\`\`\n${structure.slice(i, i + MAX_LENGTH)}\n\`\`\``)],
          flags: 64,
        });
  },
};
