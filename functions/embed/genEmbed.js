const { EmbedBuilder, Colors, Message, Client } = require('discord.js');
/**
 * Create embed field
 * @param {String} name - Field name
 * @param {String} value - Field value
 * @param {Boolean} inline - Is inline
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

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Generate embed
   * @param {Message} message - Message object
   * @param {String} method - Method to send embed
   * @param {String} title - Embed title
   * @param {String} description - Embed description
   * @param {Colors} color - Embed color
   * @param {String} footer - Embed footer
   * @param {URL} thumbnail - Embed thumbnail
   * @param {URL} image - Embed image
   * @param {Class} fieldArray - Embed fields
   */
  client.genEmbed = function genEmbed(
    message,
    method,
    title,
    description,
    color,
    footer,
    thumbnail,
    image,
    fieldArray,
  ) {
    try {
      const { checkURL } = client;
      const { author, guild, channel } = message;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: author.displayName,
          iconURL: author.displayAvatarURL(true),
        })
        .setTitle(title)
        .setDescription(description)
        .setColor(color || 'Random')
        .setThumbnail(checkURL(thumbnail) ? thumbnail : null)
        .setImage(checkURL(image) ? image : null);
      if (footer) embed.setFooter({ text: footer, iconURL: guild.iconURL(true) }).setTimestamp();

      if (fieldArray) {
        // addFields
        const arrays = fieldArray.split(' # ');
        const fields = arrays.map((f) => f.split(' ^ '));
        let objFields = [];
        for (const field of fields) {
          const f = new addFields({
            name: field[0],
            value: field[1],
            inline: field[2],
          });
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
      console.error(chalk.red('Error while running genEmbed'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
