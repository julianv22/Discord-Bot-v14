const { Client, Interaction, Message, EmbedBuilder, ChannelType, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  const regex = /\x1b\[[0-9;]*m/g;
  /** - Displays an error when caught.
   * @param {Interaction|Message} object - The interaction or message object.
   * @param {Error} e - The error object.
   * @param {string|Interaction} description - A description of the error, or the interaction object that caused the error. */
  client.catchError = async (object, e, description) => {
    const { messageEmbed, logError, guilds } = client;
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

      if (!guild) logError({ todo: 'finding error report server with ID:', item: cfg.bugGuildId });
      else if (!channel || channel.type !== ChannelType.GuildText)
        logError({ todo: 'finding error report channel with ID:', item: cfg.bugChannelId });
      else {
        const bugEmbed = new EmbedBuilder()
          .setColor(Colors.DarkVividPink)
          .setAuthor({ name: errorMessage().replace(regex, ''), iconURL: cfg.x_mark_gif })
          .setDescription(
            `**Used:** ${user.displayName || user.username} [ \`${user.id}\` ]\n\n**Server: [${
              object.guild.name
            }](https://discord.com/channels/${object.guild.id}) \n\nChannel: [# ${
              object.channel.name
            }](https://discord.com/channels/${object.guild.id}/${object.channel.id})**`
          )
          .setFooter({ text: object.guild.name + ' Error Reports', iconURL: object.guild.iconURL(true) })
          .setTimestamp();

        if (e.stack)
          bugEmbed.addFields({ name: 'Stack:', value: '```ansi\n\x1b[33m' + (e.stack || 'undefined') + '\x1b[0m```' });
        else bugEmbed.addFields({ name: 'Error Message:', value: `\`${e.message}\`` });

        if (e.cause)
          bugEmbed.addFields({ name: 'Cause:', value: '```ansi\n\x1b[36m' + (e.cause || 'undefined') + '\x1b[0m```' });

        await channel.send({ embeds: [bugEmbed] }).then(async () => {
          const embed = messageEmbed({ title: errorMessage(), desc: `\`\`\`ansi\n\x1b[33m${e}\x1b[0m\`\`\`` });

          if (object) {
            if (object?.author)
              return await object
                .reply(embed)
                .then((m) => setTimeout(async () => await m.delete().catch(console.error), 10 * 1000));
            else if (!object.replied && !object.deferred) return await object.reply(embed);
            else return await object.editReply(embed);
          }
        });
      }
    } catch (e) {
      return console.error(chalk.red('An error occurred while sending the report to the error channel log\n'), e);
    }
  };

  /**
   * @typedef {object} LoggingOptions
   * @property {boolean} [isWarn = false] - If `true`, the log will be a warning; otherwise, it will be an error.
   * @property {string} [todo = 'executing'] - Describes the action being performed when the error occurred (e.g., 'reloading').
   * @property {string} [item] - The specific item or component related to the error (e.g., 'application (/) commands').
   * @property {string} [desc] - Additional descriptive context for the error. */

  /** - Sends a console error or warning.
   * @param {LoggingOptions} options - The logging options.
   * @param {string} [options.todo='executing']
   * @param {Error} [e=null] - The error object.
   * @example
   * client.logError({ todo: 'reloading', item: 'application (/) commands', desc: 'to Discord API' }, errorObject);
   */
  client.logError = (options, e = null) => {
    const { todo = 'executing', item = '', desc = '', isWarn = false } = options;
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.green(item);
    second += (item && ' ') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? '\n' + e : '');
  };
};
