const { Client, Interaction } = require('discord.js');
/**
 * @param {Client} client - Đối tượng client
 */
module.exports = (client) => {
  /**
   * Thực thi lệnh interaction
   * @param {String} type - Loại interaction
   * @param {Interaction} interaction - Đối tượng interaction
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
