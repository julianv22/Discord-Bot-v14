/**
 * @param {Client} client - Client object
 */
module.exports = (client) => {
  /**
   * Tạo embed thông báo lỗi hoặc thành công.
   * @param {boolean|string} prefix - true = lỗi, false = thành công, string = prefix tuỳ chỉnh.
   * @param {string} desc - Nội dung thông báo.
   * @param {string} [err] - Chi tiết lỗi hệ thống (nếu có).
   * @returns {object} Đối tượng trả về cho reply/send của Discord.js.
   *
   * Ví dụ:
   *   client.errorEmbed(true, 'Có lỗi xảy ra!');
   *   client.errorEmbed(false, 'Thành công!');
   *   client.errorEmbed('⚠️ ', 'Cảnh báo!');
   */
  client.errorEmbed = function errorEmbed(prefix, desc, err) {
    let prefixText = prefix;
    let color = Math.floor(Math.random() * 16777216); // Mặc định: màu ngẫu nhiên

    if (typeof prefix === 'boolean') {
      prefixText = prefix ? '\\❌ | ' : '\\✅ | ';
      color = prefix ? 16711680 : 65280; // Đỏ nếu lỗi, xanh lá nếu thành công
    }

    return {
      embeds: [
        {
          color,
          description: prefixText + desc + (err ? `\`\`\`fix\n${err}\`\`\`` : ''),
        },
      ],
      ephemeral: true,
    };
  };
};
