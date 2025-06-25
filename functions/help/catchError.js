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
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Show error when catched
   * @param {ChatInputCommandInteraction|Message} object Interaction or Message
   * @param {Error} e Error content
   * @param {string|ChatInputCommandInteraction} description Error description */
  client.catchError = async (object, e, description) => {
    const { errorEmbed, logError, guilds } = client;
    const errorMessage = () => {
      if (typeof description === 'string') return description;

      if (typeof description === 'object')
        return `Error while executing ${chalk.green(
          `/${description.parent ? description.parent + ' ' : ''}${description.data.name}`
        )} command`;

      return 'Unknown error';
    };

    console.error(chalk.red(errorMessage() + '\n'), e);

    try {
      const guild = guilds.cache.get(cfg.bugGuildId);
      const channel = guild.channels.cache.get(cfg.bugChannelId);

      if (!guild) logError({ todo: 'finding error reporting guild with ID:', item: cfg.bugGuildId });
      else if (!channel || channel.type !== ChannelType.GuildText)
        logError({ todo: 'finding error reporting text channel with ID:', item: cfg.bugChannelId });
      else {
        const bugEmbed = new EmbedBuilder()
          .setTitle('\\❌ ' + errorMessage().replace(regex, ''))
          .setDescription(
            `**Used:** ${object.user.displayName || object.author.displayName} [ \`${
              object.user.id || object.author.id
            }\` ]\n\n**Guild: [${object.guild.name}](https://discord.com/channels/${object.guild.id}) \n\nChannel: [# ${
              object.channel.name
            }](https://discord.com/channels/${object.guild.id}/${object.channel.id})**`
          )
          .setColor(Colors.DarkVividPink)
          .setTimestamp()
          .setFooter({ text: 'Error reports', iconURL: guild.iconURL(true) });

        if (e.stack)
          bugEmbed.addFields({ name: 'Stack:', value: '```ansi\n\x1b[33m' + (e.stack || 'undefined') + '\x1b[0m```' });
        else bugEmbed.addFields({ name: 'Error Message:', value: `\`${e.message}\`` });

        if (e.cause)
          bugEmbed.addFields({ name: 'Cause:', value: '```ansi\n\x1b[36m' + (e.cause || 'undefined') + '\x1b[0m```' });

        await channel.send({ embeds: [bugEmbed] }).then(async () => {
          const embed = errorEmbed({ title: errorMessage(), desc: e });

          if (object) {
            if (object?.author)
              await object.reply(embed).then((m) =>
                setTimeout(async () => {
                  m.delete().catch(console.error);
                }, 10 * 1000)
              );
            else if (!object.replied && !object.deferred) return await object.reply(embed);
            else await object.editReply(embed);
          }
        });
      }
    } catch (e) {
      console.error(chalk.red('An error occurred while sending the report to the error channel log\n'), e);
    }
  };
  /** - Tạo một embed thông báo lỗi.
   * @param {object} options - Các tùy chọn cho embed lỗi.
   * @param {string} options.title - Tiêu đề của error embed.
   * @param {string} options.description - Mô tả chi tiết về lỗi.
   * @param {boolean|string} options.emoji - Emoji để thêm vào tiêu đề hoặc mô tả.
   * @param {boolean} [options.flags] - Cờ (flags) để xác định hành vi của embed (ví dụ: ephemeral). Mặc định là `true`.
   * @param {string} [options.color] - Màu sắc của embed.
   * @returns {EmbedBuilder} EmbedBuilder */
  client.errorEmbed = ({ title, desc, emoji = false, flags = true, color }) => {
    const embed = new EmbedBuilder();

    let prefix = '\\';
    if (typeof emoji === 'boolean') prefix += emoji ? '✅' : '❌';
    else prefix += emoji;
    prefix += ' ';

    embed.setColor(color ? color : emoji ? Colors.Green : Colors.Red);

    if (title) embed.setTitle(prefix + title.replace(regex, ''));

    const description = title ? `\`\`\`ansi\n\x1b[33m${desc}\x1b[0m\`\`\`` : prefix + desc;
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
    second += (item && ' ') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e && '\n' + e);
  };
};
