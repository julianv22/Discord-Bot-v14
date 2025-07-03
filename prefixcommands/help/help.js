const { EmbedBuilder, Colors } = require('discord.js');
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

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Danh sách Prefix Command [\`${prefix}\`]`)
      .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.helpPNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL() })
      .addFields(
        { name: `Tổng số command: [${prefixCommands.size}]`, value: `Command prefix: [\`${prefix}\`]` },
        ...listCommands(prefixCommands),
        { name: `\u200b`, value: `\`${prefix}command ?\` để xem hướng dẫn chi tiết của command` }
      );

    await message.channel.send({ embeds: [embed], components: [infoButtons()] });
  },
};
