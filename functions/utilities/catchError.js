const { Client, Interaction, ChatInputCommandInteraction, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   *
   * @param {Error} e
   * @param {ChatInputCommandInteraction} command
   * @param {Interaction} interaction
   */
  client.catchError = async (interaction, e, command) => {
    const { errorEmbed } = client;

    let error = '';

    if (typeof command === 'string') error = command;
    else
      error = command.parent
        ? `Error while executing ${command.category} /${command.parent} ${command.data.name}`
        : `Error while executing command /${command.data.name}`;

    const embed = errorEmbed({ title: `\\❌ ${error}`, description: e, color: Colors.Red });

    console.error(chalk.red(error + '\n'), e);

    if (!interaction.replied && !interaction.deferred) return await interaction.reply(embed);
    else return await interaction.editReply(embed);
  };
};
