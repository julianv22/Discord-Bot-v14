const { Client, EmbedBuilder, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Command Usage
   * @param {Message} message Message
   * @param {object} command Prefix command's options
   * @param {string} command.name Prefix command name
   * @param {string[]} command.aliases Prefix command aliases
   * @param {string} command.description Command description
   * @param {string} [usage] Command usage */
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
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`Hướng dẫn sử dụng command [\`${prefix}${name}\`]`)
        .setDescription(desc)
        .setColor(Colors.Aqua)
        .setThumbnail(cfg.helpPNG)
        .setTimestamp()
        .setFooter({
          text: `Requested by ${author.displayName || author.username}`,
          iconURL: author.displayAvatarURL(true),
        })
        .addFields({ name: 'Cách dùng:', value: `\`\`\`fix\n${usage}\`\`\`` });

      return await message.reply({ embeds: [usageEmbed] });
    } catch (e) {
      catchError(message, e, `Error while executing ${chalk.green('commandUsage')} function`);
    }
  };
};
