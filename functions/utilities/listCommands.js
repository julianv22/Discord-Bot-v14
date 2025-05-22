const { Client, Collection } = require('discord.js');
/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Danh sách các command
   * @param {Collection} CommandType - Đối tượng CommandType
   * @returns {Object} - Trả về object gồm commands và count
   */
  client.listCommands = function listCommands(CommandType) {
    try {
      var commands = [];
      const cmdCategories = CommandType.map((cmd) => cmd.category);
      const filters = cmdCategories.filter((item, index) => cmdCategories.indexOf(item) === index);

      let count = 0;
      filters.forEach((category) => {
        let cmd;
        cmd = CommandType.map((cmd) => cmd).filter((cmd) => cmd.category === category);
        count += cmd.length;
        commands.push({
          name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
          value: `\`\`\`fix\n${cmd.map((cmd) => (cmd.data ? cmd.data.name : cmd.name)).join(' | ')}\`\`\``,
        });
      });

      return { commands: commands, count: count };
    } catch (e) {
      console.error(chalk.red('Error while running listCommands'), e);
    }
  };
};
