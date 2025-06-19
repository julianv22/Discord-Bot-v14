const { EmbedBuilder, Message, Client, Colors } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** Command Usage
   * @param {Message} message - Message
   * @param {object} command Prefix command's options
   * @param {string} command.name Prefix command name
   * @param {string[]} command.aliases Prefix command aliases
   * @param {string} command.description Command description
   * @param {string} [usage] - Command usage
   * @param {Promise<void>} */
  client.commandUsage = async (message, command, usage) => {
    const { catchError } = client;
    const { guild, author } = message;
    const { name, aliases, description } = command;

    try {
      let strDesc = '⤷' + description;

      if (Array.isArray(aliases)) strDesc += `\n\nAlias: [\`${aliases.join(' | ')}\`]`;

      if (!usage) {
        usage = prefix + name;
        if (Array.isArray(aliases)) usage += ' | ' + aliases.map((a) => prefix + a).join(' | ');
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`Huớng dẫn sử dụng command [\`${prefix + name}\`]`)
        .setDescription(strDesc)
        .addFields([{ name: 'Cách dùng:', value: `\`\`\`fix\n${usage}\`\`\`` }])
        .setColor(Colors.Aqua)
        .setTimestamp()
        .setThumbnail(cfg.helpPNG)
        .setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });

      return await message.reply({ embeds: [embed] });
    } catch (e) {
      catchError(message, e, `Error while executing ${chalk.green('commandUsage')} function`);
    }
  };
};
