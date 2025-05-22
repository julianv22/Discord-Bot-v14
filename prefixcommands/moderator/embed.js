const { EmbedBuilder, Message, Client, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'embed',
  aliases: ['eb'],
  description: `Tạo Embed Message.\n\`${cfg.modRole} only\``,
  category: 'moderator',
  cooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * Tạo Embed Message
   * @param {Message} message - Đối tượng message
   * @param {Array} args - Mảng args
   * @param {Client} client - Đối tượng client
   */
  async execute(message, args, client) {
    const { guild } = message;
    const { user: bot, createEmbed, errorEmbed } = client;
    const isMod = message.member.permissions.has(PermissionFlagsBits.ManageMessages);

    const embedGuide = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Hướng dẫn sử dụng command [${this.name}]`)
      .setDescription(`⤷${this.description}\n\nAlias: \`${this.aliases}\``)
      .setColor('Aqua')
      .setThumbnail(cfg.helpPNG)
      .addFields([
        {
          name: 'Tạo embed cơ bản:',
          value: `\`\`\`fix\n${prefix + this.name} Title | Description\`\`\``,
        },
        {
          name: 'Tạo embed nâng cao:',
          value: `\`\`\`fix\n${prefix + this.name} Title | Description | Footer | ThumbnailURL | ImageURL\`\`\``,
        },
        {
          name: 'Edit embed:',
          value: `\`\`\`fix\n${prefix + this.name} edit <ID> | Title | Description...\`\`\`\n**Tham số:**`,
        },
        { name: 'ID:', value: 'ID của tin nhắn muốn edit', inline: true },
        { name: 'Title:', value: 'Tiêu đề', inline: true },
        { name: 'Description:', value: 'Nội dung', inline: true },
        {
          name: 'Footer:',
          value: 'Phần cuối embed *(có thể bỏ trống)*',
          inline: true,
        },
        {
          name: 'ThumbnailURL:',
          value: 'Ảnh thumbnail góc bên phải embed *(nếu không set có thể bỏ trống)*',
        },
        {
          name: 'ImageURL:',
          value: 'Chèn ảnh vào cuối embed *(nếu không set có thể bỏ trống)*',
        },
      ])
      .setFooter({
        text: 'Super Embed: Field 1 ^ Value 1 # Field 2 ^ Value 2 # Field 3 ^ Value 3... ',
      });

    const argEdit = args.join(' ').split(' ');

    if (argEdit[0] === '?') return message.reply({ embeds: [embedGuide] });

    if (argEdit[0] === 'edit') {
      const msgEdit = await message.channel.messages.fetch(argEdit[1]).catch(() => undefined);
      const embedEdit = args.slice(2).join(' ').split(' | ');

      if (msgEdit === undefined || !argEdit[1])
        return message.reply(errorEmbed(true, `Vui lòng nhập ID tin nhắn muốn edit!`)).then((m) => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

      if (msgEdit.author.id !== bot.id)
        return message.reply(errorEmbed(true, `Tin nhắn không phải của bot!`)).then((m) => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

      if (!embedEdit[0] || !embedEdit[1])
        return message
          .reply({
            embeds: [
              {
                color: 16711680,
                title: `\\❌ Command chưa đúng hoặc không chính xác!`,
                description: `\`\`\`fix\n${prefix + this.name} Tiêu đề | Nội dung\`\`\` \n\`${
                  prefix + this.name
                } ?\` để xem hướng dẫn chi tiết.`,
                thumbnail: { url: cfg.errorPNG || 'https://cdn-icons-png.flaticon.com/512/463/463612.png' },
              },
            ],
          })
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });
      if (message.deletable) message.delete().catch(() => {});
      await createEmbed(msgEdit, embedEdit, 'edit');
      const report = await message.channel.send(
        errorEmbed(false, `Edit Embed [\`${argEdit[1]}\`](${msgEdit.url}) thành công!`),
      );
      setTimeout(() => {
        report.delete();
      }, 10000);
    } else {
      const argEmbed = args.join(' ').split(' | ');
      if (!argEmbed[0] || !argEmbed[1])
        return message
          .reply({
            embeds: [
              {
                color: 16711680,
                title: `\\❌ Command chưa đúng hoặc không chính xác!`,
                description: `\`\`\`fix\n${prefix + this.name} Tiêu đề | Nội dung\`\`\` \n\`${
                  prefix + this.name
                } ?\` để xem hướng dẫn chi tiết.`,
                thumbnail: { url: cfg.errorPNG || 'https://cdn-icons-png.flaticon.com/512/463/463612.png' },
              },
            ],
          })
          .then((m) => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });
      if (message.deletable) message.delete().catch(() => {});
      await createEmbed(message, argEmbed, 'send');
    }
  },
};
