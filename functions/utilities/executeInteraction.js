const { Client, Interaction, Colors } = require('discord.js');

/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Execute interaction command
   * @param {String} type - Interaction type
   * @param {Interaction} interaction - Interaction object
   */
  client.executeInteraction = async (type, interaction) => {
    const { errorEmbed } = client;
    try {
      await type.execute(interaction, client);
    } catch (e) {
      const error = `Error while executing interaction [${type.data.name}]\n`;
      const embed = errorEmbed({ title: `\\❌ ${error}`, description: e, color: Colors.Red });
      console.error(chalk.red(error), e);
      if (!interaction.replied && !interaction.deferred) return await interaction.reply(embed);
      else return await interaction.editReply(embed);
    }
  };
};
