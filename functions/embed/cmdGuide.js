const { EmbedBuilder, Message, Client } = require('discord.js');
/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Hướng dẫn sử dụng command
   * @param {Message} message - Đối tượng message
   * @param {String} commandname - Tên command
   * @param {String} description - Mô tả command
   * @param {Array} alias - Alias command
   * @param {String} usage - Cách dùng command
   * @param {String} footer - Footer command
   */
  client.cmdGuide = (message, commandname, description, alias, usage, footer) => {
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
        .setColor('Aqua')
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

      message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.red('Error while running cmdGuide'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
