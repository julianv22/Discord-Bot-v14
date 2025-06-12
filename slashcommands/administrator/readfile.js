const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('readfile')
    .setDescription('Đọc nội dung của một file JavaScript và hiển thị trong code block.')
    .addStringOption((option) =>
      option
        .setName('filepath')
        .setDescription('Đường dẫn tương đối đến file JavaScript (ví dụ: ./commands/ping.js)')
        .setRequired(true),
    ), // Bắt buộc phải có đường dẫn file

  /**
   * Thực thi lệnh readfile.
   * @param {CommandInteraction} interaction Đối tượng tương tác lệnh từ Discord.
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    // Lấy đường dẫn file từ tùy chọn của lệnh
    const relativeFilePath = interaction.options.getString('filepath');

    // Tạo đường dẫn tuyệt đối cho file.
    // process.cwd() trả về thư mục làm việc hiện tại của tiến trình Node.js,
    // giúp đảm bảo đường dẫn chính xác từ gốc dự án của bạn.
    const absoluteFilePath = path.join(process.cwd(), relativeFilePath);

    // Kiểm tra xem file có phải là file .js không
    if (!relativeFilePath.endsWith('.js')) {
      return interaction.reply(
        errorEmbed({ description: 'Vui lòng chỉ đọc các file JavaScript (.js)!', emoji: false }),
      );
    }

    try {
      // Đọc nội dung file
      const fileContent = fs.readFileSync(absoluteFilePath, 'utf8');

      // Giới hạn độ dài nội dung để tránh vượt quá giới hạn tin nhắn của Discord (khoảng 2000 ký tự)
      const MAX_LENGTH = 1900; // Để lại chỗ cho '```js\n' và '\n```'

      await interaction.reply(
        errorEmbed({
          title: `\\✅ Load file: \`${relativeFilePath.split('\\').pop()}\``,
          description: `Nạp nội dung của [${relativeFilePath}] thành công!`,
          emoji: true,
        }),
      );

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
        return interaction.reply(
          errorEmbed({
            description: `Không tìm thấy file: \`${relativeFilePath}\`. Vui lòng kiểm tra lại đường dẫn.`,
            emoji: false,
          }),
        );
      } else if (error.code === 'EISDIR') {
        // Đường dẫn trỏ đến một thư mục
        return interaction.reply(
          errorEmbed({ description: `\`${relativeFilePath}\` là một thư mục, không phải một file.`, emoji: false }),
        );
      } else if (error.code === 'EACCES' || error.code === 'EPERM') {
        // Lỗi quyền truy cập
        return interaction.reply(
          errorEmbed({ description: `Không có quyền truy cập để đọc file: \`${relativeFilePath}\`.`, emoji: false }),
        );
      } else {
        // Các lỗi khác
        console.error(`Lỗi khi đọc file ${relativeFilePath}:`, error);
        return interaction.reply(
          errorEmbed({ description: `Đã xảy ra lỗi khi cố gắng đọc file \`${relativeFilePath}\`.`, emoji: false }),
        );
      }
    }
  },
};
