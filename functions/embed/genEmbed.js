const { EmbedBuilder, Colors, Message, Client } = require('discord.js');
/**
 * @param {String} name
 * @param {String} value
 * @param {Boolean} inline
 */
function addFields(name, value, inline) {
  this.name = name;
  this.value = value;
  if (inline) {
    this.inline = false;
  } else {
    this.inline = true;
  }
}

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {Message} message
   * @param {String} method
   * @param {String} title
   * @param {String} description
   * @param {Colors} color
   * @param {String} footer
   * @param {URL} thumbnail
   * @param {URL} image
   * @param {Class} fieldArray
   */
  client.genEmbed = function genEmbed(message, method, title, description, color, footer, thumbnail, image, fieldArray) {
    try {
      const { checkURL } = client;
      const { author, guild, channel } = message;
      const embed = new EmbedBuilder()
        .setAuthor({ name: author.username, iconURL: author.displayAvatarURL(true) })
        .setTitle(title)
        .setDescription(description)
        .setColor(color == Colors ? color : 'Random')
        .setThumbnail(checkURL(thumbnail) ? thumbnail : null)
        .setImage(checkURL(image) ? image : null);
      if (footer) embed.setFooter({ text: footer, iconURL: guild.iconURL(true) }).setTimestamp();

      if (fieldArray) {
        // addFields
        const arrays = fieldArray.split(' # ');
        const fields = arrays.map(f => f.split(' ^ '));
        let objFields = [];
        for (const field of fields) {
          const f = new addFields({ name: field[0], value: field[1], inline: field[2] });
          objFields.push(f);
        }
        embed.addFields(objFields);
      }

      switch (method) {
        case 'send':
          channel.send({ embeds: [embed] });
          break;

        case 'edit':
          message.edit({ embeds: [embed] });
          if (message.author.bot) return;
          break;

        case 'reply':
          message.reply({ embeds: [embed] });
          break;
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running genEmbed'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
