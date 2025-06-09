const { Message, Client, ChannelType, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * Message Content Event
   * @param {Message} message - Message object
   * @param {Client} client - Client object
   */
  async execute(message, client) {
    const { author, channel, content } = message;

    if (channel && channel.type === ChannelType.DM && content.includes('help')) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `Hi, ${author.displayName}`, iconURL: author.displayAvatarURL(true) })
            .setTitle('You cannot use commands here.')
            .setDescription('Please use commands in a server I have joined!')
            .setThumbnail(author.displayAvatarURL(true))
            .setColor(Colors.Orange),
        ],
      });
    }

    if (!content.startsWith(prefix)) {
      const hint = client.errorEmbed({
        description: `Hint: sử dụng \`${prefix}thanks\` | \`${prefix}ty\` | \`/thanks\` để cảm ơn người khác!`,
        color: 16757248,
        emoji: '\\💡',
      });
      if (author.bot) return;
      else {
        if (content.toLowerCase().includes('cảm ơn'))
          return message.reply(hint).then((m) => {
            setTimeout(() => {
              m.delete();
            }, 10000);
          });

        const thanks = ['thank', 'ty', 'thanks'];
        thanks.forEach((thank) => {
          if (content.toLowerCase().split(' ').includes(thank)) {
            return message.reply(hint).then((m) => {
              setTimeout(() => {
                m.delete();
              }, 10000);
            });
          }
        });
      }
    }
  },
};
