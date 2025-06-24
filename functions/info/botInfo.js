const { Client, ChatInputCommandInteraction, Message, EmbedBuilder, UserFlags, ChannelType } = require('discord.js');
const { connection, version } = require('mongoose');
const os = require('os');
const moment = require('moment-timezone');
const package = require('../../package.json');
const { infoButtons } = require('../common/components');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Get Bot information
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message */
  client.botInfo = async (object) => {
    const {
      catchError,
      convertUpTime,
      slashCommands,
      subCommands,
      prefixCommands,
      user: bot,
      application,
      channels,
    } = client;
    const author = object.user || object.author;

    try {
      const guilds = client.guilds.cache.map((g) => g);
      const totalmembers = guilds.reduce((total, guild) => total + guild.memberCount, 0).toLocaleString();
      const textChannels = channels.cache
        .filter((channel) => channel.type === ChannelType.GuildText)
        .size.toLocaleString();
      const voiceChannels = channels.cache
        .filter((channel) => channel.type === ChannelType.GuildVoice)
        .size.toLocaleString();
      const [status, emoji] = [
        ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'],
        ['`❌', '`✅', '`🔄', '`🆘'],
      ];
      const mapPackages = Object.entries(package.dependencies)
        .map(([a, b]) => `${a}: ${b}`)
        .join('\n');

      await bot.fetch();
      await application.fetch();

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({
          name: bot.tag + ' Information',
          iconURL: bot.displayAvatarURL(true),
        })
        .setTitle('Description:')
        .setDescription(application.description || '\u200b')
        .setThumbnail(cfg.discordQR_PNG)
        .addFields(
          { name: '👤 Username:', value: `${bot}`, inline: true },
          {
            name: `🆔: ||${bot.id}||`,
            value: `**📆 Created:** <t:${parseInt(bot.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: '👑 Owner:',
            value: application.owner ? `<@${application.owner.id}>` : 'Unknown',
            inline: false,
          },
          {
            name: `Slash Commands [${slashCommands.size + subCommands.size}]:`,
            value: `Slash commands: ${slashCommands.size}\nSub commands: ${subCommands.size}`,
            inline: true,
          },
          {
            name: `Prefix Commands [${prefixCommands.size}]:`,
            value: `Prefix: \`${prefix}\`\n[\`${prefix}help | /help\`]`,
            inline: true,
          },

          {
            name: `💎 Server(s) [${guilds.length}]:`,
            value: `Members: ${totalmembers}\nChannels:\n\`💬 ${textChannels} | 🔊 ${voiceChannels}\``,
            inline: true,
          },
          {
            name: '✅ Verified:',
            value: bot.flags & UserFlags.VerifiedBot ? '`✅ Yes`' : '`❌ No`',
            inline: true,
          },
          { name: '♻️ Version:', value: package.version, inline: true },
          { name: '📝 Node Version:', value: process.version, inline: true },
          {
            name: '📚 Database:',
            value: emoji[connection.readyState] + status[connection.readyState] + `\`\nVersion: ${version}`,
            inline: true,
          },
          {
            name: '💻 System:',
            value: os.cpus()[0].model,
            inline: true,
          },
          {
            name: `💽 OS: ${process.platform} ${process.arch}`,
            value: `💾 **RSS:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`,
            inline: true,
          },
          {
            name: '🕖 Server time:',
            value: `${moment(new Date()).format('HH:mm ddd, DD/MM/YYYY')}`,
            inline: true,
          },
          { name: '⏱️ Uptime', value: convertUpTime(), inline: true },
          {
            name: `📦 Packages [${Object.keys(package.dependencies).length}]:`,
            value: `\`\`\`yaml\n\n${mapPackages}\`\`\``,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });

      return await object.reply({ embeds: [embed], components: [infoButtons()] });
    } catch (e) {
      return await catchError(object, e, `Error while executing ${chalk.green('botInfo')} function`);
    }
  };
};
