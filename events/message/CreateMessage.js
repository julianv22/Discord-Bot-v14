const { Message, Client, ChannelType, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /** - Message Content Event
   * @param {Message} message - Message
   * @param {Client} client - Discord Client */
  async execute(message, client) {
    const { author, channel, content } = message;

    if (channel && channel.type === ChannelType.DM && content.includes('help')) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: `Hi, ${author.displayName}`, iconURL: author.displayAvatarURL(true) })
        .setTitle('You can not use commands here!')
        .setDescription('Please use commands in a server I have joined!')
        .setColor(Colors.Orange)
        .setThumbnail(author.displayAvatarURL(true));

      return await message.reply({ embeds: [embed] });
    }

    if (!content.startsWith(prefix)) {
      const hint = client.errorEmbed({
        desc: `Hint: sử dụng \`${prefix}thanks\` | \`${prefix}ty\` | \`/thanks\` để cảm ơn người khác!`,
        color: 16757248,
        emoji: '\\💡',
      });
      if (author.bot) return;
      else {
        if (content.toLowerCase().includes('cảm ơn'))
          return await message.reply(hint).then((m) => {
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 10000);
          });

        const thanks = ['thank', 'ty', 'thanks'];

        for (const thank of thanks) {
          if (content.toLowerCase().split(' ').includes(thank)) {
            return await message.reply(hint).then((m) => {
              setTimeout(async () => {
                await m.delete().catch(console.error);
              }, 10000);
            });
          }
        }
      }
    }
  },
};
