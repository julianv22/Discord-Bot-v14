const { Client, Interaction } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    try {
      const { slashCommands, subCommands, executeInteraction } = client;
      const { guild, member, commandName, options } = interaction;
      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);
        const subcommandName = options.getSubcommand(false);
        const subcommand = subCommands.get(subcommandName);

        if (command.ownerOnly && member.id !== guild.ownerId)
          return interaction.reply({ embeds: [{ color: 16711680, description: `\\❌ | You are not the Owner` }], ephemeral: true });

        if (subcommandName) executeInteraction(subcommand || command, interaction);
        else executeInteraction(command, interaction);
      }

      if (interaction.isContextMenuCommand()) {
        const context = slashCommands.get(commandName);
        if (context) executeInteraction(context, interaction);
      }
    } catch (e) {
      const error = `Error while executing command [${interaction.commandName}]`;
      interaction.reply({ embeds: [{ color: 16711680, title: `\❌ ` + error, description: `${e}` }], ephemeral: true });
      console.error(chalk.yellow.bold(error), e);
    }
  },
};
