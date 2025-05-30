const { Client, Interaction, ChannelType } = require('discord.js');
const errorEmbed = require('../../functions/embed/errorEmbed');
module.exports = {
  name: 'interactionCreate',
  /**
   * Slash Command Interaction Event
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    try {
      const { slashCommands, subCommands, executeInteraction, errorEmbed } = client;
      const { guild, member, commandName, options, channel } = interaction;

      if (channel.type === ChannelType.DM)
        return await interaction.reply(
          errorEmbed({ description: 'This command is not available in DMs', emoji: false }),
        );
      if (!guild)
        return await interaction.reply(
          errorEmbed({ description: 'This command is not available in DMs', emoji: false }),
        );

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);
        const subcommandName = options.getSubcommand(false);
        const subcommand = subCommands.get(subcommandName);

        if (command.ownerOnly && member.id !== guild.ownerId)
          return await interaction.reply(errorEmbed({ description: 'You are not the owner.', emoji: false }));

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
        await interaction
          .followUp(errorEmbed({ title: `\❌ | ${error}`, description: e, color: 'Red' }))
          .catch(() => {});
      } else {
        await interaction.reply(errorEmbed({ title: `\❌ | ${error}`, description: e, color: 'Red' })).catch(() => {});
      }
      console.error(chalk.red(error), e);
    }
  },
};
