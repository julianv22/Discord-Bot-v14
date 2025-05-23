const { EmbedBuilder, Message, Client } = require('discord.js');
/**
 * Tạo trường cho embed
 * @param {String} name - Tên của trường
 * @param {String} value - Giá trị của trường
 * @param {Boolean} inline - Có inline hay không
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

/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Create Embed
   * @param {Message} message - Message object
   * @param {Array} args - Array args
   * @param {String}  method - Send embed method
   * @param {String} args[0]  - Embed title
   * @param {String} args[1]  - Embed description
   * @param {String} args[2]  - Embed footer
   * @param {URL} args[3]  - Embed thumbnail
   * @param {URL} args[4]  - Embed image
   * @param {Class} args[5]  - Embed fields
   */
  client.createEmbed = async (message, args, method) => {
    try {
      const { checkURL } = client;
      const { author, guild, channel } = message;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: author.displayName,
          iconURL: author.displayAvatarURL(true),
        })
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
        const fields = arrays.map((f) => f.split(' ^ '));
        let objFields = [];
        for (const field of fields) {
          const f = new genEmbedField(field[0], field[1], field[2]);
          objFields.push(f);
        }

        embed.addFields(objFields);
      }

      const sendEmbed = {
        send: () => channel.send({ embeds: [embed] }),
        edit: () => message.edit({ embeds: [embed] }),
        reply: () => message.reply({ embeds: [embed] }),
      };
      sendEmbed[method]();
    } catch (e) {
      console.error(chalk.red('Error while running createEmbed'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
