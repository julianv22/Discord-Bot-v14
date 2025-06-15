const { Client, ChatInputCommandInteraction, Colors, Message } = require('discord.js');

/** @param {Client} client - Client */
module.exports = (client) => {
  /**
   * Catch Error function
   * @param {ChatInputCommandInteraction|Message} object - Interaction or Message
   * @param {Error} e - Error when catched
   * @param {Message} message - Chat input command
   */
  client.catchError = async (object, e, message) => {
    const { errorEmbed } = client;
    let errorMessage = 'Unknown error';

    if (typeof message === 'string') errorMessage = message;
    else
      errorMessage = message.parent
        ? chalk.red(`Error while executing [ ${chalk.yellow(message.category)} ] command`) +
          chalk.green(` /${message.parent} ${message.data.name}`)
        : chalk.red(`Error while executing  [ ${chalk.yellow(message.category)} ] command`) +
          chalk.green('/' + message.data.name);

    const embed = errorEmbed({ title: `\\❌ ${errorMessage}`, desc: e, color: Colors.Red });

    console.error(chalk.red(errorMessage + '\n'), e);

    if (object.author)
      return await object.reply(embed).then((m) =>
        setTimeout(async () => {
          m.delete().catch(console.error);
        }, 10 * 1000),
      );
    else {
      if (!object.replied && !object.deferred) return await object.reply(embed);
      else return await object.editReply(embed);
    }
  };
};
