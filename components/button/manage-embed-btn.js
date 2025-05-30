const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonStyle, TextInputStyle } = require('discord.js');
const { createModal, setTextInput } = require('../../functions/common/manage-embed');
module.exports = {
  data: { name: 'manage-embed-btn' },
  /**
   * Create a embed
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { customId, message, channel } = interaction;
    if (!message) return await interaction.reply(errorEmbed({ description: 'No message found', emoji: false }));
    const [, button, messageId] = customId.split(':');
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);
    const Selected = {
      author: async () => {
        const modal = createModal('manage-embed-md:author', 'Embed Manager', {
          id: 'author',
          label: 'Embed Author, variable: {guild}, {user}',
          placeholder: '{guild} = Server name, {user} = Username',
        });
        modal.addComponents(
          setTextInput({
            id: 'authorIcon',
            label: 'Author icon (*.webp)',
            placeholder: '{avatar} = User avatar, {iconURL} = Server icon',
          }),
        );
        return await interaction.showModal(modal);
      },
      title: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:title', 'Embed Manager', {
            id: 'title',
            label: 'Embed Title',
            placeholder: '{guild} = Server name, {user} = Username',
            required: true,
          }),
        );
      },
      description: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:description', 'Embed Manager', {
            id: 'description',
            label: 'Description',
            placeholder: 'Enter the embed description\n{guild} = Server name\n{user} = Username',
            style: TextInputStyle.Paragraph,
            required: true,
          }),
        );
      },
      color: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:color', 'Embed Manager', {
            id: 'color',
            label: 'Color (Empty = Random)',
            placeholder: 'Red, Blue, Green, Yellow, Gold, Orange, Aqua, Purple, ...',
            required: true,
          }),
        );
      },
      image: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:image', 'Embed Manager', {
            id: 'image',
            label: 'Image (Empty = Delete)',
            placeholder: 'Enter the image url, Empty = Delete',
          }),
        );
      },
      thumbnail: async () => {
        return await interaction.showModal(
          createModal('manage-embed-md:thumbnail', 'Embed Manager', {
            id: 'thumbnail',
            label: 'Thumbnail (Empty = Delete)',
            placeholder: 'Enter the thumbnail url, Empty = Delete',
          }),
        );
      },
      footer: async () => {
        const modal = createModal('manage-embed-md:footer', 'Embed Manager', {
          id: 'footer',
          label: 'Footer (Empty = Delete)',
          placeholder: '{guild} = Server name, {user} = Username',
        });
        modal.addComponents(
          setTextInput({
            id: 'footerIcon',
            label: 'Footer icon (*.webp)',
            placeholder: '{avatar} = User avatar, {iconURL} = Server icon',
          }),
        );
        return await interaction.showModal(modal);
      },
      timestamp: async () => {
        if (Button1.components[2].data.style === ButtonStyle.Danger) {
          getEmbeds.setTimestamp(null);
          Button1.components[2].setLabel('✅Timestamp').setStyle(ButtonStyle.Success);
        } else {
          getEmbeds.setTimestamp();
          Button1.components[2].setLabel('⛔Timestamp').setStyle(ButtonStyle.Danger);
        }
        return await interaction.update({
          embeds: [getEmbeds],
          components: [Button0, Button1],
          flags: 64,
        });
      },
      send: async () => {
        Button0.components.forEach((btn) => {
          btn.data.disabled = true;
        });
        Button1.components.forEach((btn) => {
          btn.data.disabled = true;
        });
        if (!messageId || messageId === 'undefined') {
          await channel.send({ embeds: [getEmbeds] });
          await interaction.update({ components: [Button0, Button1] });
        } else {
          try {
            const msg = await channel.messages.fetch(messageId);
            if (!msg)
              return await interaction.reply(
                errorEmbed({ description: 'Không tìm thấy message hoặc không ở channel này.', emoji: false }),
              );

            await msg.edit({ embeds: [getEmbeds] }).catch(() => {});
            await interaction.update({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`\\✅ Update successfully!`)
                  .setDescription(`Message đã được update thành công.\n\n[Jump to message](${msg.url})`),
              ],
              components: [Button0, Button1],
            });
          } catch (e) {
            console.error(chalk.red('Cannot update message'), e);
            return await interaction.reply(
              errorEmbed({ title: `\\❌ | Không thể tìm thấy hoặc cập nhật message`, description: e, color: 'Red' }),
            );
          }
        }
      },
    };
    if (typeof Selected[button] === 'function') return await Selected[button]();
  },
};
