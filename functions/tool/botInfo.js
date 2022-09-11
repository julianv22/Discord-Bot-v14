const { Client, GuildMember, Interaction, Message, ActionRowBuilder, ButtonBuilder, EmbedBuilder, UserFlags } = require('discord.js');
const { connection } = require('mongoose');
const os = require('os');
const package = require('../../package.json');

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {GuildMember} author
   * @param {Interaction} interaction
   * @param {Message} message
   */
  client.botInfo = async (author, interaction, message) => {
    try {
      const { convertTime, slashCommands, subCommands, prefixCommands, user: bot, application } = client;
      const guilds = client.guilds.cache.map(g => g);
      let totalmembers = 0;
      guilds.forEach(guild => {
        totalmembers += guild.memberCount;
      });

      const status = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
      await bot.fetch();
      await application.fetch();

      const map = Object.entries(package.dependencies)
        .map(([a, b]) => `${a}: ${b}`)
        .join('\n');

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('yt-link-btn').setLabel('YouTube').setStyle('Danger'),
        new ButtonBuilder().setCustomId('djs-support-btn').setLabel(cfg.supportServer).setStyle('Primary'),
        new ButtonBuilder().setLabel('Invite Me!').setURL(cfg.inviteLink).setStyle('Link'),
        new ButtonBuilder().setLabel('Vote!').setURL('https://top.gg/servers/954736697453731850/vote').setStyle('Link')
      );

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: bot.tag + `'s Infomation`, iconURL: bot.displayAvatarURL(true) })
        .setTitle('Description:')
        .setDescription(application.description || null)
        .setThumbnail(bot.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '👤 Username:', value: `${bot}`, inline: true },
          { name: `🆔: ||${bot.id}||`, value: `**📆 Created:** <t:${parseInt(bot.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '👑 Owner:', value: `<@${application.owner.id}>`, inline: false },
          {
            name: `Slash Commands [${slashCommands.size + subCommands.size}]:`,
            value: `Slash commands: ${slashCommands.size}\nSub commands: ${subCommands.size}`,
            inline: true,
          },
          {
            name: `Prefix Commands [${prefixCommands.size}]:`,
            value: `Prefix: \`${prefix}\`\nHelp: \`${prefix}help | /help\``,
            inline: true,
          },
          { name: '⏱️ Uptime', value: convertTime(), inline: true },
          { name: `💎 Server(s) [${guilds.length}]:`, value: `Members: ${totalmembers.toLocaleString()}`, inline: true },
          { name: '☑ Verified:', value: bot.flags & UserFlags.VerifiedBot ? 'Yes' : 'No', inline: true },
          { name: '♻️ Version:', value: `${package.version}`, inline: true },
          { name: '📝 Node Version:', value: `${process.version}`, inline: true },
          { name: '📚 Database:', value: status[connection.readyState], inline: true },
          { name: '💻 Platform', value: `${process.platform}`, inline: true },
          {
            name: '💾 System:',
            value: `**Model:** ${os.cpus()[0].model}\n**Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`,
          },
          { name: '📦 Packages:', value: `\`\`\`yaml\n\n${map}\`\`\`` }
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) });

      (interaction ? interaction : message).reply({ embeds: [embed], components: [buttons] });
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running botInfo'), e);
    }
  };
};
