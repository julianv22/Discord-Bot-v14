const { Client, ChatInputCommandInteraction, Colors, Message, EmbedBuilder, MessageFlags } = require('discord.js');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * Catch Error function
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message
   * @param {Error} e - Error when catched
   * @param {string|ChatInputCommandInteraction} message Error message
   */
  client.catchError = async (object, e, message) => {
    let errorMessage = 'Unknown error';

    if (typeof message === 'string') errorMessage = message;
    else
      errorMessage = chalk.red(
        `Error while executing ${chalk.green(`/${message.parent + ' ' || ''}${message.data.name}`)} command`,
      );

    const embed = client.errorEmbed({ title: `\\❌ ${errorMessage}`, desc: e, color: Colors.Red });

    console.error(chalk.red(errorMessage + '\n'), e);

    if (object.author)
      return await object.reply(embed).then((m) =>
        setTimeout(async () => {
          m.delete().catch(console.error);
        }, 10 * 1000),
      );
    else {
      if (!object.replied && !object.deferred) return await object.reply(embed);
      else return await object.editReply(embed);
    }
  };
  /**
   * Tạo một embed thông báo lỗi.
   * @param {object} options - Các tùy chọn cho embed lỗi.
   * @param {string} options.title - Tiêu đề của embed.
   * @param {string} options.description - Mô tả chi tiết của lỗi.
   * @param {string} [options.color] - Màu sắc của embed. Mặc định là 'Random'.
   * @param {boolean|string} [options.emoji] - Emoji để thêm vào tiêu đề hoặc mô tả. Mặc định là chuỗi rỗng.
   * @param {boolean} [options.flags] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @returns {EmbedBuilder} EmbedBuilder
   */
  client.errorEmbed = ({ title, desc, color = 'Random', emoji = false, flags = true }) => {
    const embed = new EmbedBuilder();

    if (title) {
      const regex = /\x1b\[[0-9;]*m/g;
      embed.setTitle(title.replace(regex, ''));
    }

    let prefix = '\\';
    if (typeof emoji === 'boolean') {
      prefix += emoji ? '✅' : '❌';
      embed.setColor(emoji ? 'Green' : 'Red');
    } else {
      prefix += emoji;
      embed.setColor(color);
    }

    const description = title ? `\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\`` : `${prefix} ${desc}`;
    embed.setDescription(description);

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  };
  /**
   * - Gửi `console.error` hoặc `console.warn`
   * @param {object} options Log options
   * @param {string} [options.todo]  Lỗi khi đang làm gì (executing)
   * @param {string} [options.item]  Đối tượng tương tác
   * @param {string} [options.desc] Mô tả lỗi
   * @param {boolean} [options.isWarn] isWarn = false: `console.warn`, isWarn = true: `console.error`
   * @param {Error} [e] Error
   * - Ví dụ: `logError({ todo: 'realoading', item: 'application (/) commands', desc: 'to Discord API' }, e)`
   */
  client.logError = ({ todo = 'executing', item = '', desc = '', isWarn = false }, e = null) => {
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.reset(item);
    second += (item ? ' ' : '') + chalk.green(desc);
    second += '\n';

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? e : '');
  };
};
