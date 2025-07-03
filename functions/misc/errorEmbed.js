const { Client, EmbedBuilder, MessageFlags, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Tạo một embed thông báo lỗi.
   * @param {object} options - Các tùy chọn cho embed lỗi.
   * @param {string} options.title - Tiêu đề của error embed.
   * @param {string} options.description - Mô tả chi tiết về lỗi.
   * @param {boolean|string} options.emoji - Emoji để thêm vào tiêu đề hoặc mô tả.
   * @param {boolean} [options.flags] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @param {string|Colors} [options.color] - Màu sắc của embed. */
  client.errorEmbed = ({ title, desc, emoji = false, flags = true, color }) => {
    const embed = new EmbedBuilder();

    let prefix = '\\';
    if (typeof emoji === 'boolean') prefix += emoji ? '✅' : '❌';
    else prefix += emoji;
    prefix += ' ';

    embed.setColor(color || (emoji ? Colors.Green : Colors.Red));

    if (title)
      embed.setTitle(prefix + title.replace(regex, '')).setDescription(`\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\``);
    else embed.setDescription(prefix + desc);

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
};
