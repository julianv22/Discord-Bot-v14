const { Client, Message } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Create embed array
   * @param {Message} message - Message object
   * @param {Array} args - Array args
   * @param {String} args[0] - Embed title
   * @param {String} args[1] - Embed description
   * @param {String} args[2] - Embed footer
   * @param {URL} args[3] - Embed thumbnail
   * @param {URL} args[4] - Embed image
   * @param {Class} args[5] - Embed fields
   */
  client.embedArray = function embedArray(message, args) {
    try {
      const { checkURL } = client;
      const { author } = message;
      let res = [
        {
          author: {
            name: author.displayName,
            icon_url: author.displayAvatarURL(true),
          }, // Set Author
          title: args[0], // Set Title
          description: args[1], // Set Description
          color: 'Random', // Set Color
          thumbnail: checkURL(args[3]) ? args[3] : null, // Set Thumbnail
          image: checkURL(args[4]) ? args[4] : null, // Set Image
        },
      ];

      if (args[2]) {
        res[0].footer = {
          text: args[2],
          icon_url: message.guild.iconURL(true),
        }; // Set Footer
        res[0].timestamp = new Date();
      }

      // addFields
      if (args[5]) {
        const arrays = args[5].split(' # ');
        const fields = arrays.map((f) => f.split(' ^ '));
        let objFields = [];
        for (const field of fields) {
          const f = new addFields(field[0], field[1], field[2]);
          objFields.push(f);
        }
        res[0].fields = objFields;
      }
      return res;
    } catch (e) {
      console.error(chalk.red('Error while running embedArray'), e);
      return message.channel.send({ embeds: [{ color: 16711680, description: `\\❌ | ${e}` }] }).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 10000);
      });
    }
  };
};
