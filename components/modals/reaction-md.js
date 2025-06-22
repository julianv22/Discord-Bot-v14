const { Client, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { getEmbedColor } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'reaction-md' },
  /** - Reaction Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
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
      const editEmbed = {
        title: () => {
          return reactionEmbed.setTitle(stringInput);
        },
        color: () => {
          return reactionEmbed.setColor(getEmbedColor(stringInput));
        },
      };

      if (!editEmbed[textInput])
        throw new Error(chalk.yellow("Invalid TextInput's customId ") + chalk.green(textInput));

      await editEmbed[textInput]();
      return interaction.update({ embeds: [reactionEmbed], components: [reactionButton] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
