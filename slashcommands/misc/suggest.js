const {
  Client,
  Interaction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('suggest').setDescription('Send your suggestions for this server'),
  /** - Send suggestions to this server
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('suggest').setTitle('Server Suggestions:');

    const contentInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('content')
        .setLabel('Suggestion Content')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
    );

    modal.addComponents(contentInput);
    await interaction.showModal(modal);
  },
};
