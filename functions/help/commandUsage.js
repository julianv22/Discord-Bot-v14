const { Client, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Command Usage
   * @param {Message} message - The message object.
   * @param {object} command - The prefix command options.
   * @param {string} command.name - The name of the prefix command.
   * @param {string[]} command.aliases - The aliases of the prefix command.
   * @param {string} command.description - The description of the command.
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
        if (Array.isArray(aliases)) usage += ` | ${aliases.map((a) => prefix + a).join(' | ')}`;
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

      return await message.reply({ embeds: [usageEmbed] });
    } catch (e) {
      catchError(message, e, `Error while executing ${chalk.green('commandUsage')} function`);
    }
  };
};
