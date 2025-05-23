const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
module.exports = {
  data: { name: 'create-embed-btn' },
  /**
   * Create a embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { customId, message } = interaction;
    const [, button] = customId.split(':');
    if (!message) return interaction.reply(errorEmbed(true, 'No message found'));
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    /**
     * Create a text input
     * @param {Object} options - Options object
     * @param {string} options.id - The id of the text input
     * @param {string} options.label - The label of the text input
     * @param {string} options.style - The style of the text input
     * @param {string} options.placeholder - The placeholder of the text input
     * @param {boolean} options.required - Whether the text input is required
     */
    const textInput = ({ id, label, style = TextInputStyle.Short, placeholder = '', required = false }) => {
      return new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId(id)
          .setLabel(label)
          .setValue('')
          .setStyle(style)
          .setPlaceholder(placeholder)
          .setRequired(required),
      );
    };
    const Selected = {
      title: async () => {
        const modal = new ModalBuilder().setCustomId('create-embed-md:titleInput').setTitle('Embed Create');
        modal.addComponents(
          textInput({
            id: 'titleInput',
            label: 'Title',
            style: TextInputStyle.Short,
            placeholder: 'Nhập title cho embed',
            required: true,
          }),
        );
        return await interaction.showModal(modal);
      },
      description: async () => {
        const modal = new ModalBuilder().setCustomId('create-embed-md:descriptionInput').setTitle('Embed Create');
        modal.addComponents(
          textInput({
            id: 'descriptionInput',
            label: 'Description',
            style: TextInputStyle.Paragraph,
            placeholder: 'Nhập description cho embed',
            required: true,
          }),
        );
        return await interaction.showModal(modal);
      },
      color: async () => {
        const modal = new ModalBuilder().setCustomId('create-embed-md:colorInput').setTitle('Embed Create');
        modal.addComponents(
          textInput({
            id: 'colorInput',
            label: 'Color',
            placeholder: 'Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...',
            required: true,
          }),
        );
        return await interaction.showModal(modal);
      },
      image: async () => {
        const modal = new ModalBuilder().setCustomId('create-embed-md:imageInput').setTitle('Embed Create');
        modal.addComponents(
          textInput({
            id: 'imageInput',
            label: 'Image',
            placeholder: 'Nhập image cho embed, bỏ trống để xoá',
          }),
        );
        return await interaction.showModal(modal);
      },
      thumbnail: async () => {
        const modal = new ModalBuilder().setCustomId('create-embed-md:thumbnailInput').setTitle('Embed Create');
        modal.addComponents(
          textInput({
            id: 'thumbnailInput',
            label: 'Thumbnail',
            placeholder: 'Nhập thumbnail cho embed, bỏ trống để xoá',
          }),
        );
        return await interaction.showModal(modal);
      },
      timestamp: async () => {
        if (Button1.components[0].data.style === ButtonStyle.Danger) {
          getEmbeds.setTimestamp(null);
          Button1.components[0].setLabel('✅Enable Timestamp').setStyle(ButtonStyle.Success);
        } else {
          getEmbeds.setTimestamp();
          Button1.components[0].setLabel('⛔Disable Timestamp').setStyle(ButtonStyle.Danger);
        }
        return await interaction.update({
          content: 'test',
          embeds: [getEmbeds],
          components: [Button0, Button1],
          ephemeral: true,
        });
      },
      send: async () => {
        Button0.components.forEach((btn) => {
          btn.data.disabled = true;
        });
        Button1.components.forEach((btn) => {
          btn.data.disabled = true;
        });
        await interaction.update({ components: [Button0, Button1] });
        await interaction.channel.send({ embeds: [getEmbeds] });
      },
    };
    if (typeof Selected[button] === 'function') return await Selected[button]();
  },
};
