const { Client, Interaction, SlashCommandSubcommandBuilder, Colors, EmbedBuilder } = require('discord.js');
const { readFileSync } = require('fs');
const path = require('path');

module.exports = {
  category: 'sub command',
  parent: 'read',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('file'),

  /** - Reads a file from the project.
   * @param {Interaction} interaction - Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { messageEmbed, catchError } = client;
    await interaction.deferReply({ flags: 64 });
    // Lấy đường dẫn file từ tùy chọn của lệnh
    const relativeFilePath = interaction.options.getString('filepath');
    // Tạo đường dẫn tuyệt đối cho file.
    const absoluteFilePath = path.join(process.cwd(), relativeFilePath);

    await interaction.editReply(messageEmbed({ desc: `Loading file [\`${relativeFilePath}\`]...`, emoji: '🔄' }));
    // Kiểm tra xem file có phải là file .js không
    if (!relativeFilePath.endsWith('.js'))
      return interaction.editReply(messageEmbed({ desc: 'Please only read JavaScript files (.js)!' }));

    try {
      // Đọc nội dung file
      const fileContent = readFileSync(absoluteFilePath, 'utf8');

      await interaction.editReply(
        messageEmbed({ desc: `Successfully read content of file [${relativeFilePath}]`, emoji: true })
      );

      const MAX_LENGTH = 3990;
      for (let i = 0; i < fileContent.length; i += MAX_LENGTH) {
        await interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(Math.floor(Math.random() * 0xffffff))
              .setAuthor({ name: i === 0 ? relativeFilePath : null, iconURL: cfg.book_gif })
              .setDescription(`\`\`\`js\n${fileContent.slice(i, i + MAX_LENGTH)}\n\`\`\``),
          ],
        });
      }
    } catch (error) {
      // Xử lý các lỗi khi đọc file
      if (error.code === 'ENOENT')
        // File hoặc thư mục không tồn tại
        return interaction.editReply(
          messageEmbed({ desc: `File [${relativeFilePath}] not found. Please check the path.` })
        );
      else if (error.code === 'EISDIR')
        // Đường dẫn trỏ đến một thư mục
        return interaction.editReply(messageEmbed({ desc: `[${relativeFilePath}] is a directory, not a file.` }));
      else if (error.code === 'EACCES' || error.code === 'EPERM')
        // Lỗi quyền truy cập
        return interaction.editReply(messageEmbed({ desc: `No permission to read file [${relativeFilePath}].` }));
      else return await catchError(interaction, error, this);
    }
  },
};
