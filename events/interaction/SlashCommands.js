const { Client, Interaction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    try {
      const { slashCommands, subCommands, executeInteraction, errorEmbed } = client;
      const { guild, member, commandName, options, channel } = interaction;

      if (channel.type === ChannelType.DM)
        return interaction.reply(errorEmbed(true, 'This command is not available in DMs'));
      if (!guild) return interaction.reply(errorEmbed(true, 'This command is not available in DMs'));

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);
        const subcommandName = options.getSubcommand(false);
        const subcommand = subCommands.get(subcommandName);

        if (command.ownerOnly && member.id !== guild.ownerId)
          return interaction.reply(errorEmbed(true, 'You are not the owner.'));

        if (subcommandName) executeInteraction(subcommand || command, interaction);
        else executeInteraction(command, interaction);
      }

      if (interaction.isContextMenuCommand()) {
        const context = slashCommands.get(commandName);
        if (context) executeInteraction(context, interaction);
      }
    } catch (e) {
      const error = `Error while executing command [${interaction.commandName}]`;
      if (interaction.replied || interaction.deferred) {
        interaction
          .followUp({
            embeds: [{ color: 16711680, title: `❌ ` + error, description: `${e}` }],
            ephemeral: true,
          })
          .catch(() => {});
      } else {
        interaction
          .reply({
            embeds: [{ color: 16711680, title: `❌ ` + error, description: `${e}` }],
            ephemeral: true,
          })
          .catch(() => {});
      }
      console.error(chalk.yellow.bold(error), e);
    }
  },
};
