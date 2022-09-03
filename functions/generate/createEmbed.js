const { EmbedBuilder, Message, Client } = require('discord.js');
/**
 * @param {String} name
 * @param {String} value
 * @param {Boolean} inline
 */
function genEmbedField(name, value, inline) {
  this.name = name;
  this.value = value;
  if (!inline) {
    this.inline = false;
  } else {
    this.inline = true;
  }
}

/** @param {Client} client */
module.exports = client => {
  /**
   * @param {Message} message
   * @param {Array} args
   * @param {String}  method
   * @param {String} args[0] title
   * @param {String} args[1] description
   * @param {String} args[2] footer
   * @param {URL} args[3] thumbnail
   * @param {URL} args[4] image
   * @param {Class} args[5] fields
   */
  client.createEmbed = async (message, args, method) => {
    try {
      const { checkURL } = client;
      const { author, guild, channel } = message;
      const embed = new EmbedBuilder()
        .setAuthor({ name: author.username, iconURL: author.displayAvatarURL(true) })
        .setTitle(args[0])
        .setDescription(args[1])
        .setColor('Random')
        .setImage(checkURL(args[4]) ? args[4] : null);
      if (args[2]) embed.setFooter({ text: args[2], iconURL: guild.iconURL(true) }).setTimestamp();

      /* genEmbedField Function
      E.x: Field 1 ^ Value 1 # Field 2 ^ Value 2 # Field 3 ^ Value 3 ^ 1 # Field 4 ^ Value 4 ^ 1
      */
      if (args[5]) {
        const arrays = args[5].split(' # ');
        const fields = arrays.map(f => f.split(' ^ '));
        let objFields = [];
        for (const field of fields) {
          const f = new genEmbedField(field[0], field[1], field[2]);
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
          if (author.bot) return;
        case 'reply':
          message.reply({ embeds: [embed] });
        default:
          break;
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Error while runing createEmbed'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then(m => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
