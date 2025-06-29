const { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { getEmbedColor } = require('../../functions/common/utilities');

module.exports = {
  type: 'modals',
  data: { name: 'reaction-md' },
  /** - Reaction Modal
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, fields, message } = interaction;
    const [, textInput] = customId.split(':');
    const stringInput = fields.getTextInputValue(textInput);
    const reactionEmbed = EmbedBuilder.from(message.embeds[0]);
    const reactionButton = ActionRowBuilder.from(message.components[0]);

    const editEmbed = {
      title: () => {
        return reactionEmbed.setTitle(stringInput);
      },
      color: () => {
        return reactionEmbed.setColor(getEmbedColor(stringInput));
      },
    };

    if (!editEmbed[textInput]) throw new Error(chalk.yellow("Invalid TextInput's customId ") + chalk.green(textInput));

    await editEmbed[textInput]();
    return interaction.update({ embeds: [reactionEmbed], components: [reactionButton] });
  },
};
