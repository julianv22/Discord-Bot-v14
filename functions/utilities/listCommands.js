const { Client, Collection } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * List of commands
   * @param {Collection} CommandType - CommandType object
   * @returns {Object} - Return object with commands and count
   */
  client.listCommands = (CommandType) => {
    try {
      let commands = [];
      const cmdCategories = CommandType.map((cmd) => cmd.category);
      const filters = cmdCategories.filter((item, index) => cmdCategories.indexOf(item) === index);

      let count = 0;
      filters.forEach((category) => {
        let cmd;
        cmd = CommandType.map((cmd) => cmd).filter((cmd) => cmd.category === category);
        count += cmd.length;
        commands.push({
          name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
          value: `\`\`\`ansi\n\u001b[36m${cmd
            .map((cmd) => (cmd.data ? cmd.data.name : cmd.name))
            .join(' | ')}\u001b[0m\`\`\``,
        });
      });

      return { commands: commands, count: count };
    } catch (e) {
      console.error(chalk.red('Error while executing listCommands function\n'), e);
    }
  };
};
