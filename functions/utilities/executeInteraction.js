const { Client, Interaction } = require('discord.js');
/** @param {Client} client - Client object */
module.exports = (client) => {
  /**
   * Execute interaction command
   * @param {String} type - Interaction type
   * @param {Interaction} interaction - Interaction object
   */
  client.executeInteraction = async (type, interaction) => {
    try {
      await type.execute(interaction, client);
    } catch (e) {
      const error = `Error while executing interaction [${type.data.name}]`;
      interaction.reply({
        embeds: [{ color: 16711680, title: `\\❌ ` + error, description: `${e}` }],
        ephemeral: true,
      });
      console.error(chalk.yellow(error), e);
    }
  };
};
