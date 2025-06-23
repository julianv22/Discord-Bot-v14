const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction, Colors } = require('discord.js');
const { readFileSync } = require('fs');
const path = require('path');

module.exports = {
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('file'),

  /** - Read file from project
   * @param {ChatInputCommandInteraction} interaction - Interaction
   * @param {Client} client - Discord Client */
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
      await interaction.editReply(
        errorEmbed({
          title: '\\✅ Loaded file successfully!',
          desc: 'Đọc nội dung file [ `' + relativeFilePath + '` ] thành công:',
          color: Colors.Green,
        })
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
        return interaction.editReply(
          errorEmbed({
            desc: `Không tìm thấy file [ \`${relativeFilePath}\` ]. Vui lòng kiểm tra lại đường dẫn.`,
            emoji: false,
          })
        );
      } else if (error.code === 'EISDIR') {
        // Đường dẫn trỏ đến một thư mục
        return interaction.editReply(
          errorEmbed({ desc: `[ \`${relativeFilePath}\` ] là một thư mục, không phải một file.`, emoji: false })
        );
      } else if (error.code === 'EACCES' || error.code === 'EPERM') {
        // Lỗi quyền truy cập
        return interaction.editReply(
          errorEmbed({ desc: `Không có quyền truy cập để đọc file [ \`${relativeFilePath}\` ].`, emoji: false })
        );
      } else {
        return await catchError(interaction, error, this);
      }
    }
  },
};
