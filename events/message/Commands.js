const { Message, Client, ChannelType } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /** @param {Message} message @param {Client} client */
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
            .reply(errorEmbed(true, `Command \`${prefix + cmdName}\` không chính xác hoặc không tồn tại!`))
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        if (command.permissions && !member.permissions.has(command.permissions))
          return message
            .reply(errorEmbed(true, `Bạn không có quyền sử dụng lệnh \`${prefix + cmdName}\`!`))
            .then((m) => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        await command.execute(message, args, client);
      }
    } catch (e) {
      const error = `Error while executing commands!`;
      message
        .reply({
          embeds: [{ color: 16711680, title: `\❌ ` + error, description: `${e}` }],
        })
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 5000);
        });
      console.error(chalk.yellow.bold(error), e);
    }
  },
};
