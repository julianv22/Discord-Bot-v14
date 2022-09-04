const { Message, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const package = require('../../package.json');

module.exports = {
  name: 'botinfo',
  aliases: ['bot'],
  description: `Bot's Information`,
  category: 'info',
  cooldown: 0,
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    if (args.join(' ').trim() === '?') return client.cmdGuide(message, this.name, this.description, this.aliases);

    const { user: bot, prefixCommands, slashCommands, subCommands } = client;
    const { author } = message;
    const guilds = client.guilds.cache.map(g => g);
    let totalmembers = 0;
    for (const guild of guilds) {
      totalmembers += await guild.memberCount;
    }

    const startUsage = process.cpuUsage();
    const now = Date.now();
    while (Date.now() - now < 500);
    let userUsage = (process.cpuUsage(startUsage).user / 1000).toFixed(1);
    let sysUsage = (process.cpuUsage(startUsage).system / 1000).toFixed(1) || 0;

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
      new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
      new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
      new ButtonBuilder().setLabel('Vote!').setURL('https://top.gg/servers/954736697453731850/vote').setStyle('Link')
    );

    const map = Object.entries(package.dependencies)
      .map(([a, b]) => `${a}: ${b}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${bot.tag}'s Information`, iconURL: bot.displayAvatarURL(true) })
      .setDescription(`**Username:** ${bot}`)
      .setThumbnail(bot.displayAvatarURL(true))
      .setColor('Random')
      .setTimestamp()
      .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) })
      .addFields([
        { name: `ID: ${bot.id}`, value: `\u200b`, inline: false },
        {
          name: `Slash Commands [${slashCommands.size + subCommands.size}]:`,
          value: `Slash commands: ${slashCommands.size}\nSub commands: ${subCommands.size}`,
          inline: true,
        },
        { name: `Prefix Commands [${prefixCommands.size}]:`, value: `Prefix: \`${prefix}\`\nHelp: \`${prefix}help | /help\``, inline: true },
        { name: `Server(s) [${guilds.length}]:`, value: `Members: ${totalmembers.toLocaleString()}`, inline: true },
        { name: `Author:`, value: `<@566891661616218132>`, inline: true },
        { name: `Version:`, value: `${package.version}`, inline: true },
        { name: `Node Version:`, value: `${process.version}`, inline: true },
        { name: `Platform`, value: `${process.platform}`, inline: true },
        { name: `CPU Usage:`, value: `User: ${userUsage.toLocaleString()} MB\nSystem: ${sysUsage.toLocaleString()} MB`, inline: true },
        { name: `Uptime:`, value: `${convertTime()}`, inline: true },
        { name: `Packages:`, value: `\`\`\`yaml\n\n${map}\`\`\`` },
      ]);
    message.reply({ embeds: [embed], components: [buttons] });

    function convertTime() {
      var uptime = process.uptime();
      // console.log('Uptime raw:', uptime);
      const date = new Date(uptime * 1000);
      const days = date.getUTCDate() - 1,
        hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();

      let time = [];

      if (days > 0) time.push(days + ' day' + (days == 1 ? '' : 's'));
      if (hours > 0) time.push(hours + ' h' + (hours == 1 ? '' : 's'));
      if (minutes > 0) time.push(minutes + ' mn' + (minutes == 1 ? '' : 's'));
      if (seconds > 0) time.push(seconds + ' s'); // + (seconds == 1 ? '' : 's'));
      // if (milliseconds > 0) time.push(milliseconds.toFixed(2) + ' ms' + (seconds == 1 ? '' : 's'));
      const dateString = time.join(', ');
      // console.log('Uptime: ' + dateString);
      return dateString;
    }
  },
};
