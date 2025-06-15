const { Client, CommandInteraction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * Slash Command Interaction Event
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { slashCommands, subCommands, errorEmbed, catchError } = client;
    const { guild, member, options, channel, commandName } = interaction;

    try {
      if (channel.type === ChannelType.DM) return;

      if (!guild) {
        const reply = errorEmbed({ desc: 'No guild found', emoji: false });
        if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
        else await interaction.editReply(reply);
      }

      if (interaction.isChatInputCommand()) {
        const [command, subcommandName] = [slashCommands.get(commandName), options.getSubcommand(false)];
        const subcommand = subCommands.get(subcommandName);

        if (command.ownerOnly && member.id !== guild.ownerId) {
          const reply = errorEmbed({ desc: 'You are not the owner', emoji: false });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
        }

        if (subcommandName) await (subcommand || command).execute(interaction, client);
        else await command.execute(interaction, client);
      } else if (interaction.isContextMenuCommand()) {
        const context = slashCommands.get(commandName);
        if (context) await context.execute(interaction, client);
      }
    } catch (e) {
      catchError(interaction, e, `Error while executing command ${chalk.green(commandName)}`);
    }
  },
};
