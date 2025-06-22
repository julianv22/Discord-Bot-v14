const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');
const { promises } = require('fs');
const path = require('path');

/** @param {Client} client Client */
module.exports = {
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder()
    .setName('structure')
    .setDescription('Show folder structure of project')
    .addStringOption((opt) => opt.setName('path').setDescription('Structure path')),
  /** - Project structure
   * @param {ChatInputCommandInteraction} interaction Interaction
   * @param {Client} client Client */
  async execute(interaction, client) {
    const { options, user } = interaction;
    const { catchError } = client;
    const strPaht = options.getString('path');
    const root = path.resolve(__dirname, '..', '..');

    const ignorePatterns = ['node_modules', '.git', '.gitignore', '.env', 'package-lock.json'];

    const isIgnored = (name, ignorePatterns) => {
      for (const pattern of ignorePatterns) {
        // Xử lý các trường hợp cơ bản:
        // 1. Khớp chính xác tên
        if (name === pattern) {
          return true;
        }
        // 2. Pattern thúc bằng '/' (chỉ áp dụng cho thư mục)
        if (pattern.endsWith('/') && name === pattern.slice(0, -1)) {
          return true;
        }
        // 3. Pattern có wildcard đơn giản '*' ở cuối (ví dụ: *.log)
        if (pattern.startsWith('*.') && name.endsWith(pattern.slice(1))) {
          return true;
        }
        // 4. Pattern có wildcard đơn giản '*' ở đầu (ví dụ: temp*)
        if (pattern.endsWith('*') && name.startsWith(pattern.slice(0, -1))) {
          return true;
        }
        // 5. Kiểm tra nếu tên thư mục/file chứa pattern (có thể không mong muốn với .gitignore)
        // if (name.includes(pattern)) {
        //     return true;
        // }
      }
      return false;
    };

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
          // Gọi đệ quy cho thư mục con
          structure += await directoryStructure(fullPath, indent + (isLast ? '    ' : '│   '));
        } else {
          structure += `${prefix}${file.name}\n`;
        }
      }
      return structure;
    };

    try {
      await interaction.deferReply({ flags: 64 });

      const structure = await directoryStructure(strPaht ? strPaht : root);

      const embed = new EmbedBuilder()
        .setColor(0xfed678)
        .setTitle(`\\📁 ${strPaht ? strPaht : 'Root'}:`)
        .setDescription(`\`\`\`\n${structure.slice(0, 4000)}\n\`\`\``)
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

      await interaction.editReply({ embeds: [embed], flags: 64 });

      if (structure.length > 4000) {
        for (let i = 4000; i < structure.length; i += 4000) {
          const nextEmbed = EmbedBuilder.from(embed);

          nextEmbed.setDescription(`\`\`\`\n${structure.slice(i, i + 4000)}\n\`\`\``);

          await interaction.followUp({ embeds: [nextEmbed], flags: 64 });
        }
      }
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
