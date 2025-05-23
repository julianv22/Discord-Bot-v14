const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  Client,
  Interaction,
  TextInputStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('suggest').setDescription('Send your suggestions to this server'),
  category: 'help',
  scooldown: 0,
  /**
   * Send suggestions to this server
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('suggest-md').setTitle('Server Suggestions:');

    const contentInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('content')
        .setLabel(`Suggest's Content`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );

    modal.addComponents(contentInput);
    await interaction.showModal(modal);
  },
};
