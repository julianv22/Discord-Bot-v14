const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputStyle,
} = require('discord.js');
const { setTextInputComponent } = require('../../functions/common/components');
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
    if (!message) return await interaction.reply(errorEmbed(true, 'No message found'));
    const [, button] = customId.split(':');
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const Selected = {
      title: async () => {
        const modal = new ModalBuilder()
          .setCustomId('create-embed-md:title')
          .setTitle('Embed Create')
          .addComponents(
            setTextInputComponent({
              id: 'title',
              label: 'Title',
              style: TextInputStyle.Short,
              placeholder: 'Nhập title cho embed',
              required: true,
            }),
          );
        return await interaction.showModal(modal);
      },
      description: async () => {
        const modal = new ModalBuilder()
          .setCustomId('create-embed-md:description')
          .setTitle('Embed Create')
          .addComponents(
            setTextInputComponent({
              id: 'description',
              label: 'Description',
              style: TextInputStyle.Paragraph,
              placeholder: 'Nhập description cho embed variable: {user}',
              required: true,
            }),
          );
        return await interaction.showModal(modal);
      },
      color: async () => {
        const modal = new ModalBuilder()
          .setCustomId('create-embed-md:color')
          .setTitle('Embed Create')
          .addComponents(
            setTextInputComponent({
              id: 'color',
              label: 'Color',
              placeholder: 'Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...',
              required: true,
            }),
          );
        return await interaction.showModal(modal);
      },
      image: async () => {
        const modal = new ModalBuilder()
          .setCustomId('create-embed-md:image')
          .setTitle('Embed Create')
          .addComponents(
            setTextInputComponent({
              id: 'image',
              label: 'Image',
              placeholder: 'Nhập image cho embed, bỏ trống để xoá',
            }),
          );
        return await interaction.showModal(modal);
      },
      thumbnail: async () => {
        const modal = new ModalBuilder()
          .setCustomId('create-embed-md:thumbnail')
          .setTitle('Embed Create')
          .addComponents(
            setTextInputComponent({
              id: 'thumbnail',
              label: 'Thumbnail',
              placeholder: 'Nhập thumbnail cho embed, bỏ trống để xoá',
            }),
          );
        return await interaction.showModal(modal);
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
          const modal = new ModalBuilder()
            .setCustomId('create-embed-md:footer')
            .setTitle('Embed Create')
            .addComponents(
              setTextInputComponent({
                id: 'footer',
                label: 'Footer',
                placeholder: '{user} = Username',
              }),
            )
            .addComponents(
              setTextInputComponent({
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
