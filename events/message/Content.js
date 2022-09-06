const { Message, Client, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',

  /** @param {Message} message @param {Client} client */
  async execute(message, client) {
    const { author, channel, content } = message;

    if ((channel.type === ChannelType.DM) & content.includes('help')) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `Hi, ${author.username}`, iconURL: author.displayAvatarURL(true) })
            .setTitle('You can not use command here.')
            .setDescription(`Please use command in server that I joined!`)
            .setThumbnail(author.displayAvatarURL(true))
            .setColor('Orange')
        ],
      });
    }

    if (!content.startsWith(prefix)) {
      const hint = {
        embeds: [{ color: 16757248, description: `\\💡 | Hint: sử dụng \`${prefix}thanks\` | \`${prefix}ty\` | \`/thanks\` để cảm ơn người khác!` }],
      };

      if (content.toLowerCase().includes('cảm ơn'))
        return message.reply(hint).then(m => {
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

      const thanks = ['thank', 'ty', 'thanks'];
      thanks.forEach(thank => {
        if (content.toLowerCase().split(' ').includes(thank)) {
          return message.reply(hint).then(m => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });
        }
      });
    }
  },
};
