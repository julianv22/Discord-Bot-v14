const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  Client,
  Interaction,
  TextInputStyle,
  PermissionFlagsBits,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('notification')
    .setDescription(`Send a notification. ${cfg.adminRole} only`),
  category: 'moderator',
  scooldown: 0,
  permissions: PermissionFlagsBits.Administrator,
  /**
   * Send a notification
   * @param {Interaction} interaction - Đối tượng interaction
   * @param {Client} client - Đối tượng client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('notify-md').setTitle('Notification:');

    const typeInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('type')
        .setLabel('Notify =1 / Update = 2')
        .setValue('1')
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
    );

    const titleInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder().setCustomId('title').setLabel(`Title:`).setRequired(true).setStyle(TextInputStyle.Short),
    );

    const descriptionInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('description')
        .setLabel(`Description:`)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );

    const imageInput = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('imageURL')
        .setLabel('Image URL')
        .setRequired(false)
        .setStyle(TextInputStyle.Short),
    );

    modal.addComponents(typeInput, titleInput, descriptionInput, imageInput);
    await interaction.showModal(modal);
  },
};
