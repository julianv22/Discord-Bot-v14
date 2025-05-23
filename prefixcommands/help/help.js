const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, Client, ButtonStyle } = require('discord.js');
module.exports = {
  name: 'help',
  aliases: ['h'],
  description: '`Đọc kỹ hướng dẫn SD trước khi dùng!`',
  category: 'help',
  cooldown: 0,
  /**
   * @param {Message} message - Message object
   * @param {Array} args - Array of arguments
   * @param {Client} client - Client object
   */
  async execute(message, args, client) {
    const { cmdGuide, prefixCommands, listCommands } = client;
    const { author: user, guild } = message;
    const { commands, count } = listCommands(prefixCommands);

    if (args.join(' ').trim() === '?')
      return cmdGuide(
        message,
        this.name,
        `Sử dụng \`${
          prefix + this.name
        }\` để xem danh sách các command\n\n\`${prefix}[tên command] ?\` để xen hướng dẫn chi tiết của command đó\n\n⤷${
          this.description
        }`,
      );

    const buttons = [
      { customId: 'support-btn:youtube', label: '🎬 YouTube', style: ButtonStyle.Danger },
      { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
      { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
      { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
    ];

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Danh sách Prefix Command (${prefix})`)
      .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.helpPNG)
      .addFields([
        {
          name: `Tổng số command: [${count}]`,
          value: `Command prefix: \`${prefix}\``,
        },
      ])
      .addFields(commands)
      .addFields([
        {
          name: `\u200b`,
          value: `\`${prefix}<command> ?\` để xem hướng dẫn chi tiết của command`,
        },
      ])
      .setFooter({
        text: `Requested by ${user.displayName || user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp();

    message.delete().then(() =>
      message.channel.send({
        embeds: [embed],
        components: [
          new ActionRowBuilder().addComponents(
            buttons.map((data) => {
              const button = new ButtonBuilder().setLabel(data.label).setStyle(data.style);
              if (data.customId) button.setCustomId(data.customId);
              if (data.url) button.setURL(data.url);
              return button;
            }),
          ),
        ],
      }),
    );
  },
};
