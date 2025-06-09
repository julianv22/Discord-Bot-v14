const { Client, GuildMember, Interaction, Message, EmbedBuilder, UserFlags, Colors } = require('discord.js');
const package = require('../../package.json');
const { infoButtons } = require('../common/components');
const { connection } = require('mongoose');
const os = require('os');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Bot information
   * @param {GuildMember} author - Author object
   * @param {Interaction} interaction - Interaction object
   * @param {Message} message - Message object
   */
  client.botInfo = async (author, interaction, message) => {
    const { errorEmbed, catchError } = client;
    try {
      const { convertUpTime, slashCommands, subCommands, prefixCommands, user: bot, application } = client;
      const guilds = client.guilds.cache.map((g) => g);
      let totalmembers = 0;
      guilds.forEach((guild) => (totalmembers += guild.memberCount));

      const [status, emoji] = [
        ['Disconnected \\', 'Connected \\', 'Connecting \\', 'Disconnecting \\'],
        ['❌', '✅', '🔄', '🆘'],
      ];
      await bot.fetch();
      await application.fetch();

      const map = Object.entries(package.dependencies)
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
            value: `Prefix: \`${prefix}\`\nHelp: \`${prefix}help | /help\``,
            inline: true,
          },

          {
            name: `💎 Server(s) [${guilds.length}]:`,
            value: `Members: ${totalmembers.toLocaleString()}`,
            inline: true,
          },
          {
            name: '✅ Verified:',
            value: bot.flags & UserFlags.VerifiedBot ? 'Yes' : 'No',
            inline: true,
          },
          { name: '♻️ Version:', value: package.version, inline: true },
          { name: '📝 Node Version:', value: process.version, inline: true },
          {
            name: `📚 Database:`,
            value: status[connection.readyState] + emoji[connection.readyState],
            inline: true,
          },
          {
            name: `💻 Platform: ${process.platform}`,
            value: `**CPU Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`,
            inline: true,
          },
          {
            name: '💾 System:',
            value: os.cpus()[0].model,
            inline: true,
          },
          { name: '⏱️ Uptime', value: convertUpTime() },
          { name: '📦 Packages:', value: `\`\`\`yaml\n\n${map}\`\`\`` },
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });
      (interaction ? interaction : message).reply({
        embeds: [embed],
        components: [infoButtons()],
      });
    } catch (e) {
      catchError(interaction, e, 'Error while executing botInfo function');
    }
  };
};
