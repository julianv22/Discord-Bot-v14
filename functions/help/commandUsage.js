const { Client, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Prefix Command Options
   * @typedef {object} CommandOptions
   * @property {string} name - The name of the prefix command.
   * @property {string[]} [aliases] - The alias array of the prefix command.
   * @property {string} description - The description of the command. */

  /** - Command Usage
   * @param {Message} message - The message object.
   * @param {CommandOptions} command - The prefix command options.
   * @param {string} [usage] - The usage string for the command. */
  client.commandUsage = async (message, command, usage) => {
    const { catchError } = client;
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
      await catchError(message, e, `Error while executing ${chalk.green('commandUsage')} function`);
    }
  };
};
