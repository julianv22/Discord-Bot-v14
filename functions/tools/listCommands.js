const { Client, Collection, GuildMember } = require('discord.js');

/** @param {Client} client */
module.exports = client => {
  /**
   *
   * @param {Collection} commands
   * @param {GuildMember} member
   */
  client.listCommands = function listCommands(commands, member) {
    try {
      const isAdmin = member.permissions.has('Administrator');
      var cmds = [];
      const Categories = commands.map(cmd => cmd.category);
      const filters = Categories.filter((item, index) => Categories.indexOf(item) === index);

      let count = 0;
      filters.forEach(category => {
        let cmd;
        if (!isAdmin) cmd = commands.map(cmd => cmd).filter(cmd => cmd.category === category && cmd.permissions != 8);
        else cmd = commands.map(cmd => cmd).filter(cmd => cmd.category === category);

        count += cmd.length;
        cmds.push({
          name: `📂 ${category.toUpperCase()} [${cmd.length}]`,
          value: `\`\`\`fix\n${cmd.map(cmd => (cmd.data ? cmd.data.name : cmd.name)).join(' | ')}\`\`\``,
        });
      });

      return cmds;
    } catch (e) {
      console.error(chalk.yellow.bold('Error while running listCommands'), e);
    }
  };
};
