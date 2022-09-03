const { EmbedBuilder, Message, Client } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {Message} message
   * @param {String} commandname
   * @param {String} description
   * @param {Array} alias
   * @param {String} usage
   * @param {String} footer
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
      if (footer) embed.setFooter({ text: footer, iconURL: author.displayAvatarURL(true) });
      else embed.setFooter({ text: `Requested by ${author.username}`, iconURL: author.displayAvatarURL(true) });

      message.reply({ embeds: [embed] });
    } catch (e) {
      console.error(chalk.yellow.bold('Error while runing cmdGuide'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
