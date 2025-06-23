const { ChatInputCommandInteraction, Client, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /** - Slash Command Interaction Event
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { slashCommands, subCommands, errorEmbed, catchError } = client;
    const { guild, user, channel, options, commandName } = interaction;
    const owner = await guild.fetchOwner();

    try {
      if (channel.type === ChannelType.DM) return;

      if (!guild) {
        const reply = errorEmbed({ desc: 'No guild found', emoji: false });
        if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
        else await interaction.editReply(reply);
        return;
      }

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);

        if (!command) {
          const reply = errorEmbed({ desc: `Can not find  command ${commandName}`, emoji: false });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
          return;
        }

        if (command.ownerOnly && user.id !== owner.id && user.id !== cfg.ownerID) {
          const reply = errorEmbed({ desc: 'You are not the owner', emoji: false });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
          return;
        }

        const subCommandName = options.getSubcommand(false);
        let subcommand = null;
        if (subCommandName) {
          const compoundKey = `${command.data.name}|${subCommandName}`;
          subcommand = subCommands.get(compoundKey);
        }

        if (subcommand && subcommand.parent === command.data.name) await subcommand.execute(interaction, client);
        else await command.execute(interaction, client);
      } else if (interaction.isContextMenuCommand()) {
        const context = slashCommands.get(commandName);
        if (context) await context.execute(interaction, client);
      }
    } catch (e) {
      return await catchError(interaction, e, `Error while executing ${chalk.green('/' + commandName)} command`);
    }
  },
};
