const { Client, Collection } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * List of commands
   * @param {Collection} CommandType - CommandType object
   * @returns {object} - Return object with commands and count
   */
  client.listCommands = (CommandType) => {
    try {
      let commands = [];
      const cmdCategories = CommandType.map((cmd) => cmd.category);
      const filters = cmdCategories.filter((item, index) => cmdCategories.indexOf(item) === index);

      let count = 0;
      for (const category of filters) {
        let cmd;
        cmd = CommandType.map((cmd) => cmd).filter((cmd) => cmd.category === category);
        count += cmd.length;
        commands.push({
          name: `\\📂 ${capitalize(category)} [${cmd.length}]`,
          value: `\`\`\`ansi\n\x1b[36m${cmd
            .map((cmd) => (cmd.data ? cmd.data.name : cmd.name))
            .join(' | ')}\x1b[0m\`\`\``,
        });
      }

      return { commands: commands, count: count };
    } catch (e) {
      client.logError({ item: 'listCommands', desc: 'function' }, e);
    }
  };
};
