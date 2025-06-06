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
      const desc = `Error while executing interaction [${type.data.name}]`;
      console.error(chalk.yellow(desc), e);
      return await interaction.reply(
        client.errorEmbed({
          title: `\\❌ ${desc}`,
          description: e,
          color: 'Red',
        }),
      );
    }
  };
};
