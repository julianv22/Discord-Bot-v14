const {
  Client,
  ChatInputCommandInteraction,
  Message,
  EmbedBuilder,
  MessageFlags,
  ChannelType,
  Colors,
} = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Show error when catched
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message
   * @param {Error} e Error message
   * @param {string|ChatInputCommandInteraction} description Error description */
  client.catchError = async (object, e, description) => {
    const { errorEmbed, logError, guilds } = client;

    const errorMessage = () => {
      if (description) {
        if (typeof description === 'string') return description;

        if (typeof description === 'object')
          return `Error while executing ${chalk.green(
            `/${description.parent ? description.parent + ' ' : ''}${description.data.name}`,
          )} command`;
      }

      return 'Unknown error';
    };

    const embed = errorEmbed({
      title: `\\❌ ${errorMessage()}`,
      desc: e,
      color: Colors.DarkVividPink,
    });

    try {
      const guild = guilds.cache.get(cfg.bugGuildId);
      const channel = guild.channels.cache.get(cfg.bugChannelId);

      if (!guild) logError({ todo: 'finding Bug Guild Report with id:', item: cfg.bugGuildId });
      else if (!channel || channel.type !== ChannelType.GuildText)
        logError({ todo: 'finding Bug Channel Report with id:', item: cfg.bugChannelId });
      else {
        regex = /\x1b\[[0-9;]*m/g;

        const bugEmbed = new EmbedBuilder()
          .setTitle('\\❌ ' + errorMessage().replace(regex, ''))
          .setDescription(`Message: \`${e.message || 'Unknown message'}\``)
          .setColor(Colors.DarkVividPink)
          .setTimestamp()
          .setFooter({ text: 'Error reports', iconURL: guild.iconURL(true) });

        if (e.stack)
          bugEmbed.addFields({ name: 'Stack:', value: '```ansi\n\x1b[33m' + (e.stack || 'undefined') + '\x1b[0m```' });

        if (e.cause)
          bugEmbed.addFields({ name: 'Cause:', value: '```ansi\n\x1b[36m' + (e.cause || 'undefined') + '\x1b[0m```' });

        await channel.send({ embeds: [bugEmbed] }).catch(console.error);
      }
    } catch (e) {}
    console.error(chalk.red(errorMessage() + '\n'), e);

    if (object) {
      if (object.author)
        await object.reply(embed).then((m) =>
          setTimeout(async () => {
            m.delete().catch(console.error);
          }, 10 * 1000),
        );
      else if (!object.replied && !object.deferred) return await object.reply(embed);
      else await object.editReply(embed);
    }
  };
  /** - Tạo một embed thông báo lỗi.
   * @param {object} options - Các tùy chọn cho embed lỗi.
   * @param {string} options.title - Tiêu đề của embed.
   * @param {string} options.description - Mô tả chi tiết của lỗi.
   * @param {string} [options.color] - Màu sắc của embed. Mặc định là 'Random'.
   * @param {boolean|string} [options.emoji] - Emoji để thêm vào tiêu đề hoặc mô tả. Mặc định là chuỗi rỗng.
   * @param {boolean} [options.flags] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @returns {EmbedBuilder} EmbedBuilder */
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
  /** - Gửi `console.error` hoặc `console.warn`
   * @param {object} options Log options
   * @param {string} [options.todo]  Lỗi khi đang làm gì (executing)
   * @param {string} [options.item]  Đối tượng tương tác
   * @param {string} [options.desc] Mô tả lỗi
   * @param {boolean} [options.isWarn] isWarn = false: `console.warn`, isWarn = true: `console.error`
   * @param {Error} [e] Error message
   * - Ví dụ: `logError({ todo: 'realoading', item: 'application (/) commands', desc: 'to Discord API' }, e)` */
  client.logError = ({ todo = 'executing', item = '', desc = '', isWarn = false }, e = null) => {
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.green(item);
    second += (item ? ' ' : '') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? '\n' + e : '');
  };
};
