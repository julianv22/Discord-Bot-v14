const { Message, Client, ChannelType, Colors } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * Message Command Event
   * @param {Message} message - Message object
   * @param {Client} client - Client object
   */
  async execute(message, client) {
    try {
      const { prefixCommands, errorEmbed } = client;
      const { content, channel, author, member } = message;

      if (channel.type === ChannelType.DM) return;
      if (author.bot) return;

      if (content.startsWith(prefix)) {
        const args = content.slice(prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const command =
          prefixCommands.get(cmdName) || prefixCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!command)
          return message
            .reply(
              errorEmbed({
                description: `Command \`${prefix + cmdName}\` không chính xác hoặc không tồn tại!`,
                emoji: false,
              }),
            )
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        if (command.permissions && !member.permissions.has(command.permissions))
          return message
            .reply(
              errorEmbed({ description: `Bạn không có quyền sử dụng lệnh \`${prefix + cmdName}\`!`, emoji: false }),
            )
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        await command.execute(message, args, client);
      }
    } catch (e) {
      const error = `An error occurred while executing the command!`;
      message.reply(errorEmbed({ title: `\\❌ ${error}`, description: e, color: Colors.red })).then((m) => {
        setTimeout(() => {
          m.delete();
        }, 5000);
      });
      console.error(chalk.red(error), e);
    }
  },
};
