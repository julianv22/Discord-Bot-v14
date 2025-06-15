const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  Embed,
} = require('discord.js');
const { promises } = require('fs');
const path = require('path');

/** @param {Client} client */
module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('structure')
    .setDescription('Show folder structure of project'),
  /**
   * Project structure
   * @param {ChatInputCommandInteraction} interaction Interaction
   * @param {Client} client Client
   */
  async execute(interaction, client) {
    const { catchError } = client;
    const root = path.resolve(__dirname, '..', '..');

    const ignorePatterns = ['node_modules', '.git', '.gitignore', '.env', 'package-lock.json'];

    const isIgnored = (name, ignorePatterns) => {
      for (const pattern of ignorePatterns) {
        // Xử lý các trường hợp cơ bản:
        // 1. Khớp chính xác tên
        if (name === pattern) {
          return true;
        }
        // 2. Mẫu kết thúc bằng '/' (chỉ áp dụng cho thư mục)
        if (pattern.endsWith('/') && name === pattern.slice(0, -1)) {
          // Đây là một thư mục và tên khớp với mẫu thư mục
          return true;
        }
        // 3. Mẫu có wildcard đơn giản '*' ở cuối (ví dụ: *.log)
        if (pattern.startsWith('*.') && name.endsWith(pattern.slice(1))) {
          return true;
        }
        // 4. Mẫu có wildcard đơn giản '*' ở đầu (ví dụ: temp*)
        if (pattern.endsWith('*') && name.startsWith(pattern.slice(0, -1))) {
          return true;
        }
        // 5. Kiểm tra nếu tên thư mục/file chứa mẫu (có thể không mong muốn với .gitignore)
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

      const structure = await directoryStructure(root);

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('\\📁 Cấu trúc Project')
        .setDescription(`\`\`\`\n${structure.slice(0, 4000)}\n\`\`\``)
        .setFooter({ text: `Yêu cầu bởi ${interaction.user.tag}` });

      await interaction.editReply({ embeds: [embed], flags: 64 });

      if (structure.length > 4000) {
        for (let i = 4000; i < structure.length; i += 4000) {
          let nextEmbed = EmbedBuilder.from(embed);
          nextEmbed.setDescription(`\`\`\`\n${structure.slice(i, i + 4000)}\n\`\`\``);
          await interaction.followUp({ embeds: [nextEmbed], flags: 64 });
        }
      }
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
