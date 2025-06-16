const { EmbedBuilder, Message, Client } = require('discord.js');
const { infoButtons } = require('../../functions/common/components');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Đọc kỹ hướng dẫn SD trước khi dùng!',
  category: 'help',
  cooldown: 0,
  /**
   * @param {Message} message - Message
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client
   */
  async execute(message, args, client) {
    const { commandUsage, prefixCommands, listCommands } = client;
    const { author: user, guild } = message;
    const { commands, count } = listCommands(prefixCommands);

    if (args.join(' ').trim() === '?')
      return await commandUsage(
        message,
        this,
        `Sử dụng ${
          prefix + this.name
        } để xem danh sách các command\n\n${prefix}[tên command] ? để xen hướng dẫn chi tiết của command đó\n\n⤷${
          this.description
        }`,
      );

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Danh sách Prefix Command [\`${prefix}\`]`)
      .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.helpPNG)
      .addFields([
        {
          name: `Tổng số command: [${count}]`,
          value: `Command prefix: [\`${prefix}\`]`,
        },
      ])
      .addFields(commands)
      .addFields([
        {
          name: `\u200b`,
          value: `\`${prefix}command ?\` để xem hướng dẫn chi tiết của command`,
        },
      ])
      .setFooter({
        text: `Requested by ${user.displayName || user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp();

    await message.delete().then(
      async () =>
        await message.channel.send({
          embeds: [embed],
          components: [infoButtons()],
        }),
    );
  },
};
