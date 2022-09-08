const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Client } = require('discord.js');

module.exports = {
  name: 'slashcmd',
  aliases: ['scmd'],
  description: 'Danh sách Slash Command (/)',
  category: 'help',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { cmdGuide, slashCommands, subCommands } = client;
    const { author: user, member, guild } = message;

    if (args.join(' ').trim() === '?') return cmdGuide(message, this.name, this.description, this.aliases);

    const isAdmin = member.permissions.has('Administrator');

    let cmds = [];
    const Categories = slashCommands.map(cmd => cmd.category);
    const filters = Categories.filter((item, index) => Categories.indexOf(item) === index);

    let count = 0;
    filters.forEach(category => {
      let cmd;
      if (!isAdmin) cmd = slashCommands.map(cmd => cmd).filter(cmd => cmd.category === category && cmd.permissions != 8);
      else cmd = slashCommands.map(cmd => cmd).filter(cmd => cmd.category === category);
      count += cmd.length;
      cmds.push({
        name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
        value: `\`\`\`fix\n${cmd.map(cmd => cmd.data.name).join(' | ') || 'None'}\`\`\``,
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
      .setTitle('Danh sách Slash Command (/)')
      .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`${cfg.supportServer}\`](${cfg.supportLink})`)
      .setColor('Random')
      .setThumbnail(cfg.slashPNG)
      .addFields({ name: `Tổng số command: [${count}]`, value: `Sub commands: [${subCommands.size}]` })
      .addFields(...cmds)
      .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    message.delete().then(() => message.channel.send({ embeds: [embed], components: [buttons] }));
  },
};
