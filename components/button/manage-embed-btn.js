const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
} = require('discord.js');
const { createModal, setEmbedInput } = require('../../functions/common/embedManager');
module.exports = {
  data: { name: 'manage-embed-btn' },
  /**
   * Create a embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { customId, message } = interaction;
    if (!message) return await interaction.reply(errorEmbed(true, 'No message found'));
    const [, button] = customId.split(':');
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const Selected = {
      title: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:title', 'Embed Manager', {
            id: 'title',
            label: 'Title',
            style: TextInputStyle.Short,
            placeholder: 'Nhập title cho embed',
            required: true,
          }),
        );
      },
      description: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:description', 'Embed Manager', {
            id: 'description',
            label: 'Description',
            style: TextInputStyle.Paragraph,
            placeholder: 'Nhập description cho embed variable: {user}',
            required: true,
          }),
        );
      },
      color: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:color', 'Embed Manager', {
            id: 'color',
            label: 'Color',
            placeholder: 'Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...',
            required: true,
          }),
        );
      },
      image: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:image', 'Embed Manager', {
            id: 'image',
            label: 'Image',
            placeholder: 'Nhập image cho embed, bỏ trống để xoá',
          }),
        );
      },
      thumbnail: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:thumbnail', 'Embed Manager', {
            id: 'thumbnail',
            label: 'Thumbnail',
            placeholder: 'Nhập thumbnail cho embed, bỏ trống để xoá',
          }),
        );
      },
      footer: async () => {
        if (Button1.components[0].data.style === ButtonStyle.Danger) {
          getEmbeds.setFooter({ text: null });
          Button1.components[0].setLabel('✅Enable Footer').setStyle(ButtonStyle.Success);
          return await interaction.update({
            embeds: [getEmbeds],
            components: [Button0, Button1],
            ephemeral: true,
          });
        } else {
          const modal = createModal('manage-embed-md:footer', 'Embed Manager', {
            id: 'footer',
            label: 'Footer',
            placeholder: '{user} = Username',
          });
          modal.addComponents(
            setEmbedInput({
              id: 'footerIcon',
              label: 'Footer Icon Url',
              placeholder: '{avatar} or link (*.webp)',
            }),
          );
          return await interaction.showModal(modal);
        }
      },
      timestamp: async () => {
        if (Button1.components[1].data.style === ButtonStyle.Danger) {
          getEmbeds.setTimestamp(null);
          Button1.components[1].setLabel('✅Enable Timestamp').setStyle(ButtonStyle.Success);
        } else {
          getEmbeds.setTimestamp();
          Button1.components[1].setLabel('⛔Disable Timestamp').setStyle(ButtonStyle.Danger);
        }
        return await interaction.update({
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
