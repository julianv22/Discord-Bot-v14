const { Client, Interaction, Message, EmbedBuilder, ChannelType, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Show error when catched
   * @param {Interaction|Message} object Interaction or Message
   * @param {Error} e Error content
   * @param {string|Interaction} description Error description */
  client.catchError = async (object, e, description) => {
    const { errorEmbed, logError, guilds } = client;
    const user = object.user || object.author;

    const errorMessage = () => {
      if (typeof description === 'string') return description;

      if (typeof description === 'object')
        return `Error while executing ${chalk.green(
          `/${description.parent ? description.parent + ' ' : ''}${description.data.name}`
        )} command`;

      return 'Unknown error';
    };

    console.error(chalk.red(errorMessage() + '\n'), e);

    try {
      const guild = guilds.cache.get(cfg.bugGuildId);
      const channel = guild.channels.cache.get(cfg.bugChannelId);

      if (!guild) logError({ todo: 'finding error reporting guild with ID:', item: cfg.bugGuildId });
      else if (!channel || channel.type !== ChannelType.GuildText)
        logError({ todo: 'finding error reporting text channel with ID:', item: cfg.bugChannelId });
      else {
        const bugEmbed = new EmbedBuilder()
          .setColor(Colors.DarkVividPink)
          .setTitle('\\❌ ' + errorMessage().replace(regex, ''))
          .setDescription(
            `**Used:** ${user.displayName || user.username} [ \`${user.id}\` ]\n\n**Guild: [${
              object.guild.name
            }](https://discord.com/channels/${object.guild.id}) \n\nChannel: [# ${
              object.channel.name
            }](https://discord.com/channels/${object.guild.id}/${object.channel.id})**`
          )
          .setFooter({ text: 'Error reports', iconURL: object.guild.iconURL(true) })
          .setTimestamp();

        if (e.stack)
          bugEmbed.addFields({ name: 'Stack:', value: '```ansi\n\x1b[33m' + (e.stack || 'undefined') + '\x1b[0m```' });
        else bugEmbed.addFields({ name: 'Error Message:', value: `\`${e.message}\`` });

        if (e.cause)
          bugEmbed.addFields({ name: 'Cause:', value: '```ansi\n\x1b[36m' + (e.cause || 'undefined') + '\x1b[0m```' });

        await channel.send({ embeds: [bugEmbed] }).then(async () => {
          const embed = errorEmbed({ title: errorMessage(), desc: e });

          if (object) {
            if (object?.author)
              await object.reply(embed).then((m) =>
                setTimeout(async () => {
                  m.delete().catch(console.error);
                }, 10 * 1000)
              );
            else if (!object.replied && !object.deferred) return await object.reply(embed);
            else await object.editReply(embed);
          }
        });
      }
    } catch (e) {
      console.error(chalk.red('An error occurred while sending the report to the error channel log\n'), e);
    }
  };

  /** - Send `console.error` or `console.warn`
   * @param {object} options Log options
   * @param {string} [options.todo]  Error when (ex: When executing)
   * @param {string} [options.item] Highlight
   * @param {string} [options.desc] Description
   * @param {boolean} [options.isWarn] isWarn = false: `console.warn`, isWarn = true: `console.error`
   * @param {Error} [e] Error message
   * - Ex: `logError({ todo: 'realoading', item: 'application (/) commands', desc: 'to Discord API' }, e)` */
  client.logError = ({ todo = 'executing', item = '', desc = '', isWarn = false }, e = null) => {
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.green(item);
    second += (item && ' ') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? '\n' + e : '');
  };
};
