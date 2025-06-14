const { Client, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { getEmbedColor } = require('../../functions/common/manage-embed');

module.exports = {
  data: { name: 'reaction-md' },
  /**
   * Reaction Modal
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { customId, fields, message } = interaction;
    const { catchError } = client;
    const [, textInput] = customId.split(':');
    const [stringInput, reactionEmbed, reactionButton] = [
      fields.getTextInputValue(textInput),
      EmbedBuilder.from(message.embeds[0]),
      ActionRowBuilder.from(message.components[0]),
    ];

    try {
      const inputModal = {
        title: () => reactionEmbed.setTitle(stringInput),
        color: () => reactionEmbed.setColor(getEmbedColor(stringInput)),
      };

      if (!inputModal[textInput])
        throw new Error(chalk.yellow("Invalid TextInput's customId ") + chalk.green(textInput));

      await inputModal[textInput]();
      return interaction.update({ embeds: [reactionEmbed], components: [reactionButton] });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
