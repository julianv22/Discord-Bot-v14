const { Client, Collection } = require('discord.js');
const { capitalize } = require('../common/utilities');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - List of command name filtered by property from Command Collection
   * @param {Collection<string, object>} command Command Collection
   * @param {string|'category'} [property] Filter by property
   * @returns {object[]} */
  client.listCommands = (command, property = 'category') => {
    try {
      const commandCat = command.reduce((acc, cmd) => {
        acc[cmd[property]] = (acc[cmd[property]] || 0) + 1;
        return acc;
      }, {});

      let commands = [];
      Object.entries(commandCat).forEach(([prop, count]) => {
        let cmds = command.filter((cmd) => cmd[property] === prop).map((c) => c?.data?.name || c?.name);

        commands.push({
          name: `\\📂 ${capitalize(prop)} [${count}]`,
          value: `\`\`\`ansi\n\x1b[36m${cmds.join(' | ')}\x1b[0m\`\`\``,
        });
      });

      return commands;
    } catch (e) {
      client.logError({ item: 'listCommands', desc: 'function' }, e);
    }
  };
};
