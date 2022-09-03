const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, Client, Interaction, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('suggest').setDescription('Send suggestions.'),
  category: 'help',
  scooldown: 0,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('suggest-md').setTitle('Server Suggestionns:');

    const contentInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId('content').setLabel(`Suggestion's Content`).setRequired(true).setStyle(TextInputStyle.Paragraph)
    );

    modal.addComponents(contentInput);
    interaction.showModal(modal);
  },
};
