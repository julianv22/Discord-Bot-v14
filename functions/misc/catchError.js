const { Client, Interaction, Message, EmbedBuilder, ChannelType, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Displays an error when caught.
   * @param {Interaction|Message} object - The interaction or message object.
   * @param {Error} e - The error content.
   * @param {string|Interaction} description - A description of the error, or the interaction object itself. */
  client.catchError = async (object, e, description) => {
    const { errorEmbed, logError, guilds } = client;
    const user = object?.user || object?.author;

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

  /** - Sends a console error or warning.
   * @param {object} options - Log options.
   * @param {string} [options.todo='executing'] - Describes what was being done when the error occurred (e.g., 'reloading').
   * @param {string} [options.item=''] - The specific item related to the error (e.g., 'application (/) commands').
   * @param {string} [options.desc=''] - Additional description for the error.
   * @param {boolean} [options.isWarn=false] - If true, logs as a warning; otherwise, logs as an error.
   * @param {Error} [e=null] - The error object itself.
   * @example
   * client.logError({ todo: 'reloading', item: 'application (/) commands', desc: 'to Discord API' }, errorObject);
   */
  client.logError = ({ todo = 'executing', item = '', desc = '', isWarn = false }, e = null) => {
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.green(item);
    second += (item && ' ') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? '\n' + e : '');
  };
};
