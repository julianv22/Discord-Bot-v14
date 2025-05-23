const {
  SlashCommandBuilder,
  Interaction,
  Client,
  PermissionFlagsBits,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setName('edit-embed')
    .setDescription(`Edit Embed. ${cfg.modRole} only`),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.ManageMessages,
  /**
   * Edit/Create Embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('embed-editor-md').setTitle('Edit Embed Message:');

    const msgidInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('msgid')
        .setLabel('Message ID:')
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
    );

    const titleInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('title')
        .setLabel(`Embed's Title:`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
    );

    const descriptionInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('description')
        .setLabel(`Embed's Description:`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );

    const thumbnailInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('thumbnailURL')
        .setLabel('Thumbnail URL')
        .setRequired(false)
        .setStyle(TextInputStyle.Short),
    );

    const imageInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('imageURL')
        .setLabel('Image URL')
        .setRequired(false)
        .setStyle(TextInputStyle.Short),
    );

    modal.addComponents(msgidInput, titleInput, descriptionInput, thumbnailInput, imageInput);
    await interaction.showModal(modal);
  },
};
