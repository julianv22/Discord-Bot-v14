const {
  Client,
  GuildMember,
  CommandInteraction,
  Message,
  EmbedBuilder,
  UserFlags,
  ChannelType,
} = require('discord.js');
const { connection, version } = require('mongoose');
const os = require('os');
const package = require('../../package.json');
const { infoButtons } = require('../common/components');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Bot information
   * @param {GuildMember} author - Author object
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.botInfo = async (author, interaction, message) => {
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
    try {
      const guilds = client.guilds.cache.map((g) => g);

      const textChannels = channels.cache.filter((c) => c.type === ChannelType.GuildText).size.toLocaleString();
      const voiceChannels = channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size.toLocaleString();

      let totalmembers = 0;
      for (const guild of guilds) totalmembers += guild.memberCount;

      const [status, emoji] = [
        ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'],
        ['\\❌', '\\✅', '\\🔄', '\\🆘'],
      ];

      await bot.fetch();
      await application.fetch();

      const mapPackages = Object.entries(package.dependencies)
        .map(([a, b]) => `${a}: ${b}`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({
          name: bot.tag + ' Information',
          iconURL: bot.displayAvatarURL(true),
        })
        .setTitle('Description:')
        .setDescription(application.description || null)
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
            value: `Prefix: \`${prefix}\`\n(\`${prefix}help | /help\`)`,
            inline: true,
          },

          {
            name: `💎 Server(s) [${guilds.length}]:`,
            value: `Members: ${totalmembers.toLocaleString()}\nChannels:\n\`💬 ${textChannels} | 🔊 ${voiceChannels}\``,
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
            value: emoji[connection.readyState] + status[connection.readyState] + `\nVersion: ${version}`,
            inline: true,
          },
          {
            name: '💾 System:',
            value: os.cpus()[0].model,
            inline: true,
          },
          {
            name: `💻 Platform: \`${process.platform} ${process.arch}\``,
            value: `💾 **RSS:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB`,
            inline: true,
          },
          { name: '🕖 Server time:', value: `<t:${parseInt(new Date() / 1000)}:F>`, inline: true },
          { name: '⏱ Uptime', value: convertUpTime(), inline: true },
          {
            name: `📦 Packages [${Object.keys(package.dependencies).length}]:`,
            value: `\`\`\`yaml\n\n${mapPackages}\`\`\``,
          },
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });

      if (interaction)
        if (!interaction.replied && !interaction.deferred)
          await interaction.reply({ embeds: [embed], components: [infoButtons()] });
        else interaction.editReply({ embeds: [embed], components: [infoButtons()] });
      else if (message) await message.reply({ embeds: [embed], components: [infoButtons()] });
    } catch (e) {
      catchError(interaction, e, 'Error while executing botInfo function');
    }
  };
};
