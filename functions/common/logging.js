const { EmbedBuilder, MessageFlags, Colors } = require('discord.js');

module.exports = {
  /** - The options for creating the error embed.
   * @typedef {object} EmbedData
   * @property {string} [title] - The title of the embed.
   * @property {string} desc - The detailed description of the embed.
   * @property {string|number} [color] - The color of the embed.
   * @property {boolean|string} [emoji = false] - The emoji to prefix the title or description. If boolean, uses default success/error emojis.
   * @property {boolean} [flags = true] - Whether the message should be ephemeral. Defaults to `true`. */

  /** - Creates an embed object.
   * @param {EmbedData} options - The options for creating the embed. */
  embedMessage: (options) => {
    const { title, desc, color, flags = true } = options || {};
    let { emoji = false } = options || {};
    const regex = /\x1b\[[0-9;]*m/g;
    const author = title?.replace(regex, '') || desc;

    const embed = new EmbedBuilder().setColor(color || (emoji ? Colors.Green : Colors.Red));

    if (!desc)
      return {
        embeds: [embed.setAuthor({ name: 'Missing embed description!', iconURL: cfg.x_mark_gif })],
        flags: MessageFlags.Ephemeral,
      };

    const setEmbedData = {
      boolean: () =>
        embed
          .setAuthor({ name: author, iconURL: emoji ? cfg.verified_gif : cfg.x_mark_gif })
          .setDescription(title ? desc : null),
      string: () => {
        if (emoji.checkURL())
          return embed.setAuthor({ name: author, iconURL: emoji }).setDescription(title ? desc : null);
        else {
          emoji = `\\${emoji} `;
          return embed.setTitle(title ? emoji + author : null).setDescription((title ? '' : emoji) + desc);
        }
      },
      default: () => embed.setTitle(title ? title : null).setDescription(desc),
    };

    (setEmbedData[typeof emoji] || setEmbedData.default)();

    return { embeds: [embed], ...(flags && { flags: MessageFlags.Ephemeral }) };
  },
  /** - Prefix Command Options Configuration
   * @typedef {object} CommandOptions
   * @property {string} name - The name of the prefix command.
   * @property {string} description - The description of the command.
   * @property {string[]} [aliases] - The alias array of the prefix command. */

  /** - Command Usage
   * @param {Message} message - The message object.
   * @param {CommandOptions} command - The prefix command options.
   * @param {string} [usage] - The usage string for the command. */
  commandUsage: async (message, command, usage) => {
    const { guild, author } = message;
    const { name, aliases, description } = command;

    try {
      let desc = '⤷' + description;

      if (Array.isArray(aliases) && aliases.length > 0) desc += `\n\nAlias: [\`${aliases.join(' | ')}\`]`;

      if (!usage) {
        usage = `${prefix}${name}`;
        if (Array.isArray(aliases) && aliases.length > 0) usage += ` | ${aliases.map((a) => prefix + a).join(' | ')}`;
      }

      const usageEmbed = new EmbedBuilder()
        .setColor(Colors.Aqua)
        .setThumbnail(cfg.helpPNG)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`Hướng dẫn sử dụng command [\`${prefix}${name}\`]`)
        .setDescription(desc)
        .setFooter({
          text: `Requested by ${author.displayName || author.username}`,
          iconURL: author.displayAvatarURL(true),
        })
        .setTimestamp()
        .setFields({ name: 'Cách dùng:', value: `\`\`\`fix\n${usage}\`\`\`` });

      await message.reply({ embeds: [usageEmbed] });
    } catch (e) {
      module.exports.logError({ item: 'commandUsage', desc: 'function' }, e);
    }
  },
  /** - LoggingOptions Configuration
   * @typedef {object} LoggingOptions
   * @property {boolean} [isWarn = false] - If `true`, the log will be a warning; otherwise, it will be an error.
   * @property {string} [todo = 'executing'] - Describes the action being performed when the error occurred (e.g., 'reloading').
   * @property {string} [item] - The specific item or component related to the error (e.g., 'application (/) commands').
   * @property {string} [desc] - Additional descriptive context for the error. */

  /** - Sends a console error or warning.
   * @param {LoggingOptions} options - The logging options.
   * @param {Error} [e = null] - The error object.
   * @example
   * client.logError({ todo: 'reloading', item: 'application (/) commands', desc: 'to Discord API' }, errorObject);
   */
  logError: (options, e = null) => {
    const { todo = 'executing', item, desc, isWarn = false } = options;
    const color = isWarn ? 'yellow' : 'red';
    const first = chalk[color](isWarn ? `[Warn] ${todo}` : `Error while ${todo}`);
    let second = chalk.green(item);
    second += (item && ' ') + chalk[color](desc);

    const func = isWarn ? console.warn : console.error;
    func(first, second, e ? '\n' + e : '');
  },
};
