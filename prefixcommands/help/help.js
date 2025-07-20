const { Client, Message, EmbedBuilder, Colors } = require('discord.js');
const { infoButtons } = require('../../functions/common/components');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Đọc kỹ hướng dẫn SD trước khi dùng!',
  category: 'help',
  cooldown: 0,
  /** - Help prefix command
   * @param {Message} message - Message
   * @param {string[]} args - Array of arguments
   * @param {Client} client - Discord Client */
  async execute(message, args, client) {
    const { commandUsage, prefixCommands, listCommands } = client;
    const { author: user, guild } = message;

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        `Sử dụng ${
          prefix + this.name
        } để xem danh sách các command\n\n${prefix}[tên command] ? để xen hướng dẫn chi tiết của command đó\n\n⤷${
          this.description
        }`
      );

    await message.delete();

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setThumbnail(cfg.helpPNG)
        .setAuthor({ name: guild.name, iconURL: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f3af/512.gif' })
        .setTitle(`Danh sách Prefix Command [\`${prefix}\`]`)
        .setDescription(
          `Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`
        )
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
        .setTimestamp()
        .setFields(
          { name: `Tổng số command: [${prefixCommands.size}]`, value: `Command prefix: [\`${prefix}\`]` },
          ...listCommands(prefixCommands),
          { name: `\u200b`, value: `\`${prefix}command ?\` để xem hướng dẫn chi tiết của command` }
        ),
    ];

    await message.channel.send({ embeds, components: [infoButtons()] });
  },
};
