const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  category: 'administrator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('notification')
    .setDescription(`Sends a notification to users. (${cfg.adminRole} only)`),
  /** - Sends a notification to users
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('notify-md').setTitle('Notification:');
    const typeInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('type')
        .setLabel('Notification Type (1: Notify, 2: Update)')
        .setValue('1')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
    );
    const titleInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('title')
        .setLabel('Notification Title:')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
    );
    const descriptionInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Notification Description:')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
    );
    const imageInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('imageURL')
        .setLabel('Image URL (Optional)')
        .setRequired(false)
        .setStyle(TextInputStyle.Short)
    );

    modal.addComponents(typeInput, titleInput, descriptionInput, imageInput);
    await interaction.showModal(modal);
  },
};
