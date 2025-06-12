const { Client, CommandInteraction, ChatInputCommandInteraction, Colors, Message } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Catch Error function
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Error} e - Error when catched
   * @param {ChatInputCommandInteraction} command - Chat input command
   */
  client.catchError = async (interaction, e, command) => {
    const { errorEmbed } = client;

    let errorMessage = 'Unknown error';

    if (typeof command === 'string') errorMessage = command;
    else
      errorMessage = command.parent
        ? `Error while executing ${command.category} /${command.parent} ${command.data.name}`
        : `Error while executing ${command.category} command /${command.data.name}`;

    const embed = errorEmbed({ title: `\\❌ ${errorMessage}`, description: e, color: Colors.Red });

    console.error(chalk.red(errorMessage + '\n'), e);
    if (!interaction.replied && !interaction.deferred) return await interaction.reply(embed);
    else return await interaction.editReply(embed);
  };
};
