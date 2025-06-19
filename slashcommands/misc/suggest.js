const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  Client,
  ChatInputCommandInteraction,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  category: 'misc',
  scooldown: 0,
  data: new SlashCommandBuilder().setName('suggest').setDescription('Send your suggestions to this server'),
  /** - Send suggestions to this server
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('suggest-md').setTitle('Server Suggestions:');

    const contentInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('content')
        .setLabel("Suggest's Content")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );

    modal.addComponents(contentInput);
    await interaction.showModal(modal);
  },
};
