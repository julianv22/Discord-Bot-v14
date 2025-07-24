const { Client, Interaction, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /** - Slash Command Interaction Event
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { slashCommands, subCommands, messageEmbed, catchError } = client;
    const { guild, user, channel, options, commandName } = interaction;
    const owner = await guild.fetchOwner();

    try {
      if (channel.type === ChannelType.DM) return;

      if (!guild) {
        const reply = messageEmbed({ desc: 'No guild found' });
        if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
        else await interaction.editReply(reply);
        return;
      }

      if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(commandName);

        if (!command) {
          const reply = messageEmbed({ desc: `Can not find  command ${commandName}` });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
          return;
        }

        if (command.ownerOnly && user.id !== owner.id && user.id !== cfg.ownerID) {
          const reply = messageEmbed({ desc: 'You are not the owner' });
          if (!interaction.replied && !interaction.deferred) await interaction.reply(reply);
          else await interaction.editReply(reply);
          return;
        }

        const subCommandName = options.getSubcommand(false);

        let subCommand = null;
        if (subCommandName) subCommand = subCommands.get(`${command.data.name}|${subCommandName}`);

        if (subCommand && subCommand.parent === command.data.name) await subCommand.execute(interaction, client);
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
