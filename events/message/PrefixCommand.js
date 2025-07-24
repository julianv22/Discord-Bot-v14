const { Client, Message, ChannelType } = require('discord.js');

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
      const args = content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command =
        prefixCommands.get(commandName) ||
        prefixCommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

      /** - Set timeout for message before delete
       * @param {string} desc Message content
       * @param {number} [seconds = 10] Timeout before delete in seconds */
      const timeoutMessage = async (desc, seconds = 10) =>
        await message
          .reply(errorEmbed({ desc }))
          .then((m) => setTimeout(async () => await m.delete().catch(console.error), seconds * 1000));

      if (!command) return await timeoutMessage(`Command ${prefix + commandName} không chính xác hoặc không tồn tại!`);
      try {
        if (command.permissions && !member.permissions.has(command.permissions))
          return await timeoutMessage(`Bạn không có quyền sử dụng lệnh ${prefix + commandName}`);

        await command.execute(message, args, client);
      } catch (e) {
        await catchError(message, e, `Error while executing prefix command [ ${chalk.green(prefix + command.name)} ]`);
      }
    }
  },
};
