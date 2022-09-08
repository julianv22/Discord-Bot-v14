const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: '`Đọc kỹ hướng dẫn SD trước khi dùng!`',
  category: 'help',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { cmdGuide, prefixCommands } = client;
    const { author: user, member, guild } = message;

    if (args.join(' ').trim() === '?')
      return cmdGuide(
        message,
        this.name,
        `Sử dụng \`${
          prefix + this.name
        }\` để xem danh sách các command\n\n\`${prefix}[tên command] ?\` để xen hướng dẫn chi tiết của command đó\n\n⤷${this.description}`
      );

    const isAdmin = member.permissions.has('Administrator');
    let cmds = [];
    const Categories = prefixCommands.map(cmd => cmd.category);
    const filters = Categories.filter((item, index) => Categories.indexOf(item) === index);

    let count = 0;
    filters.forEach(category => {
      var cmd;
      if (!isAdmin) cmd = prefixCommands.map(cmd => cmd).filter(cmd => cmd.category === category && !cmd.description.includes(cfg.adminRole));
      else cmd = prefixCommands.map(cmd => cmd).filter(cmd => cmd.category === category);

      count += cmd.length;

      cmds.push({
        name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
        value: `\`\`\`fix\n${cmd.map(cmd => cmd.name).join(' | ')}\`\`\``,
      });
    });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
      new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
      new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
      new ButtonBuilder().setLabel('Vote!').setStyle('Link').setURL('https://top.gg/servers/954736697453731850/vote')
    );

    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle(`Danh sách Prefix Command (${prefix})`)
      .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.helpPNG)
      .addFields([{ name: `Tổng số command: [${count}]`, value: `Command prefix: \`${prefix}\`` }])
      .addFields(...cmds)
      .addFields([{ name: `\u200b`, value: `\`${prefix}<command> ?\` để xem hướng dẫn chi tiết của command` }])
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL() })
      .setTimestamp();

    message.delete().then(() => message.channel.send({ embeds: [embed], components: [buttons] }));
  },
};
