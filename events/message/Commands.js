const { Message, Client } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    try {
      const { prefixCommands} = client;
      const { content, guild, channel, author, member } = message;
      if (channel.type === 'DM') return;
      if (author.bot) return;

      if (content.startsWith(prefix)) {
        // Check Bot Permissions
        if (!guild.members.me.permissions.has('SendMessages', 'ManageMessages', 'EmbedLinks', 'AddReactions'))
          return console.log('\n\n-----------Bot CANT send message!!-----------\n\n');

        const args = content.slice(prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const command = prefixCommands.get(cmdName) || prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!command)
          return message
            .reply({ embeds: [{ color: 16711680, description: `\\❌ | Command \`${prefix + cmdName}\` không chính xác hoặc không tồn tại!` }] })
            .then(m => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        if (command.permissions && !member.permissions.has(command.permissions))
          return message
            .reply({
              embeds: [{ color: 16711680, description: `\\❌ | Bạn không được cấp quyền để sử dụng command này!` }],
            })
            .then(m => {
              setTimeout(() => {
                m.delete();
              }, 5000);
            });

        await command.execute(message, args, client);
      }
    } catch (e) {
      console.error(chalk.yellow.bold('messageCreate event'), e);
    }
  },
};
