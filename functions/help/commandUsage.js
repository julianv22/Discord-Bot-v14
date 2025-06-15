const { EmbedBuilder, Message, Client, Colors } = require('discord.js');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * Command Usage
   * @param {Message} message - Message
   * @param {object} command Prefix command's options
   * @param {string} [usage] - Command usage
   * @param {Promise<void>}
   */
  client.commandUsage = async (message, command, usage) => {
    const { catchError } = client;
    const { guild, author } = message;
    const { name, aliases, description } = command;

    try {
      let stDesc = '⤷' + description;
      if (Array.isArray(aliases) && aliases.length) stDesc += `\n\nAlias: [\`${aliases}\`]`;

      if (!usage) {
        usage = prefix + name;
        if (Array.isArray(aliases) && aliases.length) aliases.forEach((alias) => (usage += ' | ' + prefix + alias));
      }

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`Huớng dẫn sử dụng command [\`${prefix + name}\`]`)
        .setDescription(stDesc)
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
