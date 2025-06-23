const { Message, Client, ChannelType } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /** - Message PrefixCommand Event
   * @param {Message} message - Message
   * @param {Client} client - Discord Client */
  async execute(message, client) {
    const { prefixCommands, errorEmbed, catchError } = client;
    const { content, channel, author, member } = message;

    if (channel.type === ChannelType.DM) return;
    if (author.bot) return;

    if (content.startsWith(prefix)) {
      const args = content.slice(prefix.length).split(/ +/),
        commandName = args.shift().toLowerCase(),
        command =
          prefixCommands.get(commandName) ||
          prefixCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command)
        return await message
          .reply(
            errorEmbed({
              desc: `Command [\`${prefix + commandName}\`] không chính xác hoặc không tồn tại!`,
              emoji: false,
            })
          )
          .then((m) => {
            setTimeout(async () => {
              await m.delete().catch(console.error);
            }, 5000);
          });
      try {
        if (command.permissions && !member.permissions.has(command.permissions))
          return await message
            .reply(errorEmbed({ desc: `Bạn không có quyền sử dụng lệnh [\`${prefix + commandName}\`]!`, emoji: false }))
            .then((m) => {
              setTimeout(async () => {
                await m.delete().catch(console.error);
              }, 5000);
            });

        await command.execute(message, args, client);
      } catch (e) {
        catchError(message, e, `Error while executing prefix command [ ${chalk.green(prefix + command.name)} ]`);
      }
    }
  },
};
