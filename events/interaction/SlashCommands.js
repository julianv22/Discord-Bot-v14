const { Client, Interaction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Slash Command Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { slashCommands, subCommands, executeInteraction, errorEmbed, catchError } = client;
    const { guild, member, options, channel, commandName } = interaction;

    try {
      if (channel.type === ChannelType.DM) return;

      if (!guild) {
        const reply = errorEmbed({ description: 'No guild found', emoji: false });
        if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
        else await interaction.editReply(reply);
      }

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);
        const subcommandName = options.getSubcommand(false);
        const subcommand = subCommands.get(subcommandName);

        if (command.ownerOnly && member.id !== guild.ownerId) {
          const reply = errorEmbed({ description: 'You are not the owner', emoji: false });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
        }

        if (subcommandName) await executeInteraction(subcommand || command, interaction);
        else await executeInteraction(command, interaction);
      } else if (interaction.isContextMenuCommand()) {
        const context = slashCommands.get(commandName);
        if (context) await executeInteraction(context, interaction);
      }
    } catch (e) {
      catchError(interaction, e, `Error while executing command ${interaction.commandName}`);
    }
  },
};
