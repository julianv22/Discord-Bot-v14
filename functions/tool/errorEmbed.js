const { Client, EmbedBuilder, MessageFlags } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Tạo một embed thông báo lỗi.
   * @param {object} options - Các tùy chọn cho embed lỗi.
   * @param {string} options.title - Tiêu đề của embed.
   * @param {string} options.description - Mô tả chi tiết của lỗi.
   * @param {string} [options.color='Random'] - Màu sắc của embed. Mặc định là 'Random'.
   * @param {string} [options.emoji=''] - Emoji để thêm vào tiêu đề hoặc mô tả. Mặc định là chuỗi rỗng.
   * @param {boolean} [options.flags=true] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @returns {EmbedBuilder} EmbedBuilder
   */
  client.errorEmbed = ({ title, desc, color = 'Random', emoji = '', flags = true }) => {
    const embed = new EmbedBuilder();

    if (title) {
      const regex = /\x1b\[[0-9;]*m/g;
      embed.setTitle(title.replace(regex, ''));
    }

    let prefix = '\\';
    if (typeof emoji === 'boolean') {
      prefix += emoji ? '✅' : '❌';
      embed.setColor(emoji ? 'Green' : 'Red');
    } else embed.setColor(color);

    const description = title ? `\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\`` : `${prefix} ${desc}`;
    embed.setDescription(description);

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
