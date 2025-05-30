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
      console.error(chalk.yellow(`Error while executing interaction [${type.data.name}]`), e);
      return await interaction.reply(
        client.errorEmbed({
          title: `\\❌ | Error while executing interaction [${type.data.name}]`,
          description: e,
          color: 'Red',
        }),
      );
    }
  };
};
