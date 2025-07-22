const { Client, Collection } = require('discord.js');

/** @param {Client} client - Discord Client */
module.exports = (client) => {
  /** - Generates a list of command names, filtered by a specified property from a Command Collection.
   * @param {Collection<string, object>} commands - The Command Collection to list.
   * @param {string} [property = 'category'] - The property to filter commands by (e.g., 'category'). */
  client.listCommands = (commands, property = 'category') => {
    try {
      const commandCat = commands.reduce((acc, cmd) => {
        acc[cmd[property]] = (acc[cmd[property]] || 0) + 1;
        return acc;
      }, {});

      const commandFields = [];
      for (const [prop, count] of Object.entries(commandCat)) {
        const cmds = commands.filter((cmd) => cmd[property] === prop).map((cmd) => cmd?.data?.name || cmd?.name);

        commandFields.push({
          name: `\\📂 ${prop.toCapitalize()} [${count}]`,
          value: `\`\`\`ansi\n\x1b[36m${cmds.join(' | ')}\x1b[0m\`\`\``,
        });
      }

      return commandFields;
    } catch (e) {
      client.logError({ item: 'listCommands', desc: 'function' }, e);
      return [];
    }
  };
};
