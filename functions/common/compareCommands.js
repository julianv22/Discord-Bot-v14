module.exports = {
  /**
   * @param {REST} rest
   * @param {object[]} newCommands
   */
  compareCommands: async (currentCommands, newCommands) => {
    const curCmdName = new Set(currentCommands.map((cmd) => cmd.name));
    const newCmdName = new Set(newCommands.map((cmd) => cmd.name));
    const added = [...newCmdName].filter((cmd) => !curCmdName.has(cmd));
    const removed = [...curCmdName].filter((cmd) => !newCmdName.has(cmd));
    const modified = currentCommands.filter((curCmd) => {
      const newCmd = newCommands.find((newCmd) => newCmd.name === curCmd.name);

      if (newCmd) {
        const curProp = { description: curCmd.description || null };
        const newProp = { description: newCmd.description || null };

        return JSON.stringify(curProp) !== JSON.stringify(newProp);
      }
      return false;
    });

    added.length > 0 &&
      console.log(
        chalk.yellow(`Added ${added.length} command${added.length > 1 ? 's' : ''}:`),
        chalk.green(added.join(', '))
      );
    removed.length > 0 &&
      console.log(
        chalk.yellow(`Remove ${removed.length} command${removed.length > 1 ? 's' : ''}:`),
        chalk.green(removed.join(', '))
      );
    // modified.length > 0 &&
    //   console.log(chalk.yellow('Updated commands:'), chalk.green(modified.map((m) => m.name).join(', ')));
  },
};
