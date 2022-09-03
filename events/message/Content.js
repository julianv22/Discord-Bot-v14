const { Message, Client } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { content } = message;
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
