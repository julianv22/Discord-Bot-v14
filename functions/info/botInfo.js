const {
  Client,
  GuildMember,
  Interaction,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  UserFlags,
  ButtonStyle,
} = require('discord.js');
const { connection } = require('mongoose');
const os = require('os');
const package = require('../../package.json');
/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Thông tin bot
   * @param {GuildMember} author - Đối tượng author
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Message} message - Đối tượng message
   */
  client.botInfo = async (author, interaction, message) => {
    try {
      const { convertUpTime, slashCommands, subCommands, prefixCommands, user: bot, application } = client;
      const guilds = client.guilds.cache.map((g) => g);
      let totalmembers = 0;
      guilds.forEach((guild) => {
        totalmembers += guild.memberCount;
      });

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

      const buttons = [
        { customId: 'support-btn:youtube', label: 'YouTube', style: ButtonStyle.Danger },
        { customId: 'support-btn:server', label: cfg.supportServer, style: ButtonStyle.Primary },
        { url: cfg.inviteLink, label: '🔗 Invite Me', style: ButtonStyle.Link },
        { url: 'https://top.gg/servers/954736697453731850/vote', label: '👍 Vote!', style: ButtonStyle.Link },
      ];

      (interaction ? interaction : message).reply({
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
      });
    } catch (e) {
      const errorEmbed = {
        embeds: [{ color: 16711680, title: '❌ Error', description: `${e}` }],
      };
      if (interaction && typeof interaction.reply === 'function') {
        interaction.reply({ ...errorEmbed, ephemeral: true }).catch(() => {});
      } else if (message && typeof message.reply === 'function') {
        message.reply(errorEmbed).catch(() => {});
      }
      console.error(chalk.red('Error while running botInfo'), e);
    }
  };
};
