const { Client, EmbedBuilder, MessageFlags } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Tạo một embed thông báo lỗi.
   * @param {Object} options - Các tùy chọn cho embed lỗi.
   * @param {String} options.title - Tiêu đề của embed.
   * @param {String} options.description - Mô tả chi tiết của lỗi.
   * @param {String} [options.color='Random'] - Màu sắc của embed. Mặc định là 'Random'.
   * @param {String} [options.emoji=''] - Emoji để thêm vào tiêu đề hoặc mô tả. Mặc định là chuỗi rỗng.
   * @param {Boolean} [options.flags=true] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @returns {EmbedBuilder} EmbedBuilder
   */
  client.errorEmbed = ({ title, description, color = 'Random', emoji = '', flags = true }) => {
    const embed = new EmbedBuilder();
    if (title) embed.setTitle(title);
    let prefix = '';

    if (typeof emoji === 'boolean') {
      prefix = emoji ? '\\✅' : '\\❌';
      embed.setColor(emoji ? 'Green' : 'Red');
    } else {
      prefix = emoji;
      embed.setColor(color);
    }

    let desc = title ? `\`\`\`ansi\n\u001b[33m${description}\u001b[0m\`\`\`` : `${prefix} ${description}`;

    embed.setDescription(desc);

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
