const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits, Colors } = require('discord.js');
const { readFileSync } = require('fs');
const path = require('path');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('readfile')
    .setDescription(`Read JavaScript file content. ${cfg.adminRole} only`)
    .addStringOption((option) =>
      option
        .setName('filepath')
        .setDescription('Đường dẫn tương đối đến file JavaScript (ví dụ: ./commands/ping.js)')
        .setRequired(true),
    ),
  /**
   * Thực thi lệnh readfile.
   * @param {CommandInteraction} interaction Đối tượng tương tác lệnh từ Discord.
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed, catchError } = client;
    await interaction.deferReply({ flags: 64 });
    // Lấy đường dẫn file từ tùy chọn của lệnh
    const relativeFilePath = interaction.options.getString('filepath');
    // Tạo đường dẫn tuyệt đối cho file.
    const absoluteFilePath = path.join(process.cwd(), relativeFilePath);

    await interaction.editReply(errorEmbed({ desc: `Loading file [ \`${relativeFilePath}\` ]...`, emoji: '🔃' }));
    // Kiểm tra xem file có phải là file .js không
    if (!relativeFilePath.endsWith('.js')) {
      return interaction.editReply(errorEmbed({ desc: 'Vui lòng chỉ đọc các file JavaScript (.js)!', emoji: false }));
    }

    try {
      // Đọc nội dung file
      const fileContent = readFileSync(absoluteFilePath, 'utf8');

      const MAX_LENGTH = 1990;
      await interaction.editReply({
        embeds: [
          {
            title: '\\✅ Loaded file successfully!',
            description: 'Đọc nội dung file [ `' + relativeFilePath + '` ] thành công:',
            color: Colors.Green,
          },
        ],
      });

      for (let i = 0; i < fileContent.length; i += MAX_LENGTH) {
        await interaction.followUp({
          content: `\`\`\`js\n${fileContent.slice(i, i + MAX_LENGTH)}\n\`\`\``,
          flags: 64,
        });
      }
    } catch (error) {
      // Xử lý các lỗi khi đọc file
      if (error.code === 'ENOENT') {
        // File hoặc thư mục không tồn tại
        return interaction.editReply(
          errorEmbed({
            description: `Không tìm thấy file [ \`${relativeFilePath}\` ]. Vui lòng kiểm tra lại đường dẫn.`,
            emoji: false,
          }),
        );
      } else if (error.code === 'EISDIR') {
        // Đường dẫn trỏ đến một thư mục
        return interaction.editReply(
          errorEmbed({ desc: `[ \`${relativeFilePath}\` ] là một thư mục, không phải một file.`, emoji: false }),
        );
      } else if (error.code === 'EACCES' || error.code === 'EPERM') {
        // Lỗi quyền truy cập
        return interaction.editReply(
          errorEmbed({ desc: `Không có quyền truy cập để đọc file [ \`${relativeFilePath}\` ].`, emoji: false }),
        );
      } else {
        catchError(interaction, error, this);
      }
    }
  },
};
