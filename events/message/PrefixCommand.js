const { Message, Client, ChannelType, Colors } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * Message Command Event
   * @param {Message} message - Message
   * @param {Client} client - Client
   */
  async execute(message, client) {
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
        return await message
          .reply(
            errorEmbed({
              description: `Command \`${prefix + cmdName}\` không chính xác hoặc không tồn tại!`,
              emoji: false,
            }),
          )
          .then((m) => {
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 5000);
          });
      try {
        if (command.permissions && !member.permissions.has(command.permissions))
          return await message
            .reply(errorEmbed({ desc: `Bạn không có quyền sử dụng lệnh \`${prefix + cmdName}\`!`, emoji: false }))
            .then((m) => {
              setTimeout(async () => {
                await m.delete().catch(console.error);
              }, 5000);
            });

        await command.execute(message, args, client);
      } catch (e) {
        const error = `Error while executing command [${command.name}]\n`;
        await message.reply(errorEmbed({ title: `\\❌ ${error}`, desc: e, color: Colors.Red })).then((m) => {
          setTimeout(async () => {
            await m.delete().catch(console.error);
          }, 5000);
        });
        console.error(chalk.red(error), e);
      }
    }
  },
};
