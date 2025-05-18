const {
  SlashCommandSubcommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  Client,
  Interaction,
  TextInputStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder().setName('creator'),
  category: 'sub command',
  parent: 'embed',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('create-embed-md').setTitle('Create Embed Message:');

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

    const colorInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('color')
        .setLabel(`Embed's Color`)
        .setValue('Random')
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
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

    modal.addComponents(titleInput, descriptionInput, colorInput, thumbnailInput, imageInput);
    await interaction.showModal(modal);
  },
};
