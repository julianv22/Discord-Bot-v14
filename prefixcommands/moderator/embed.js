const { EmbedBuilder, Message, Client, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'embed',
  aliases: ['eb'],
  description: `Tạo Embed Message.\n\`${cfg.modRole} only\``,
  category: 'moderator',
  cooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { guild } = message;
    const { user: bot, createEmbed } = client;
    const isMod = message.member.permissions.has(PermissionFlagsBits.ManageMessages);

    const embedGuide = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Hướng dẫn sử dụng command [${this.name}]`)
      .setDescription(`⤷${this.description}\n\nAlias: \`${this.aliases}\``)
      .setColor('Aqua')
      .setThumbnail(cfg.helpPNG)
      .addFields([
        { name: 'Tạo embed cơ bản:', value: `\`\`\`fix\n${prefix + this.name} Title | Description\`\`\`` },
        { name: 'Tạo embed nâng cao:', value: `\`\`\`fix\n${prefix + this.name} Title | Description | Footer | ThumbnailURL | ImageURL\`\`\`` },
        { name: 'Edit embed:', value: `\`\`\`fix\n${prefix + this.name} edit <ID> | Title | Description...\`\`\`\n**Tham số:**` },
        { name: 'ID:', value: 'ID của tin nhắn muốn edit', inline: true },
        { name: 'Title:', value: 'Tiêu đề', inline: true },
        { name: 'Description:', value: 'Nội dung', inline: true },
        { name: 'Footer:', value: 'Phần cuối embed *(có thể bỏ trống)*', inline: true },
        { name: 'ThumbnailURL:', value: 'Ảnh thumbnail góc bên phải embed *(nếu không set có thể bỏ trống)*' },
        { name: 'ImageURL:', value: 'Chèn ảnh vào cuối embed *(nếu không set có thể bỏ trống)*' },
      ])
      .setFooter({ text: 'Super Embed: Field 1 ^ Value 1 # Field 2 ^ Value 2 # Field 3 ^ Value 3... ' });

    const argEdit = args.join(' ').split(' ');

    if (argEdit[0] === '?') return message.reply({ embeds: [embedGuide] });

    if (argEdit[0] === 'edit') {
      const msgEdit = await message.channel.messages.fetch(argEdit[1]).catch(() => undefined);
      const embedEdit = args.slice(2).join(' ').split(' | ');

      if (msgEdit === undefined || !argEdit[1])
        return message.reply({ embeds: [{ color: 16711680, description: `\\❌ | Message ID \`${args[1]}\` không chính xác!` }] }).then(m => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

      if (msgEdit.author.id !== bot.id)
        return message
          .reply({
            embeds: [{ color: 16711680, description: `\\❌ | Tin nhắn [\`${args[1]}\`](${msgEdit.url}) không phải tin nhắn của ${bot}` }],
          })
          .then(m => {
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
                description: `\`\`\`fix\n${prefix + this.name} Tiêu đề | Nội dung\`\`\` \n\`${prefix + this.name} ?\` để xem hướng dẫn chi tiết.`,
                thumbnail: { url: cfg.errorPNG },
              },
            ],
          })
          .then(m => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });

      message.delete();
      await createEmbed(msgEdit, embedEdit, 'edit');

      const report = await message.channel.send({
        embeds: [{ color: 65280, description: `\\✅ | Edit Embed [\`${argEdit[1]}\`](${msgEdit.url}) thành công!` }],
      });
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
                description: `\`\`\`fix\n${prefix + this.name} Tiêu đề | Nội dung\`\`\` \n\`${prefix + this.name} ?\` để xem hướng dẫn chi tiết.`,
                thumbnail: { url: cfg.errorPNG },
              },
            ],
          })
          .then(m => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });

      message.delete();
      createEmbed(message, argEmbed, 'send');
    }
  },
};
