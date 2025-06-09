const { EmbedBuilder, Message, Client, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Command Guide
   * @param {Message} message - Message object
   * @param {String} commandname - Command name
   * @param {String} description - Command description
   * @param {Array} alias - Command alias
   * @param {String} usage - Command usage
   * @param {String} footer - Embed footer
   */
  client.cmdGuide = async (message, commandname, description, alias, usage, footer) => {
    try {
      const { guild, author } = message;
      let stDesc = '⤷' + description;
      if (alias) stDesc += `\n\nAlias: \`${alias}\``;

      if (!usage) usage = prefix + commandname;

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle(`Huớng dẫn sử dụng command [${commandname}]`)
        .setDescription(stDesc)
        .addFields([{ name: 'Cách dùng:', value: `\`\`\`fix\n${usage}\`\`\`` }])
        .setColor(Colors.Aqua)
        .setTimestamp()
        .setThumbnail(cfg.helpPNG);
      if (footer)
        embed.setFooter({
          text: footer,
          iconURL: author.displayAvatarURL(true),
        });
      else
        embed.setFooter({
          text: `Requested by ${author.displayName}`,
          iconURL: author.displayAvatarURL(true),
        });

      await message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error while executing cmdGuide function\n'), e);
      return await message.channel
        .send(
          client.errorEmbed({
            title: '\\❌ Error while executing cmdGuide function',
            description: e,
            color: Colors.Red,
          }),
        )
        .then((m) => {
          setTimeout(async () => {
            await m.delete();
          }, 10000);
        });
    }
  };
};
