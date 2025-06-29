const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  ButtonStyle,
  TextInputStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'manage-embed-btn' },
  /** - Create/edit embed
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { customId, message, channel } = interaction;
    const { errorEmbed, catchError } = client;
    const [, button, messageId] = customId.split(':');
    const editEmbed = EmbedBuilder.from(message.embeds[0]);
    const Button0 = ActionRowBuilder.from(message.components[0]);
    const Button1 = ActionRowBuilder.from(message.components[1]);

    if (!message) return await interaction.reply(errorEmbed({ desc: 'No message found' }));
    /** - Create Interaction Modal
     * @param {object[]} options */
    const createModal = (options) => {
      const textInputs = rowComponents(options, ComponentType.TextInput);
      const actionRows = textInputs.map((txt) => new ActionRowBuilder().addComponents(txt));
      const modal = new ModalBuilder().setCustomId(`manage-embed-md:${button}`).setTitle('Embed Manager');
      actionRows.forEach((row) => modal.addComponents(row));
      return modal;
    };

    const showModal = {
      author: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'author',
              label: 'Embed Author, variable: {guild}, {user}',
              placeholder: '{guild} = Server name, {user} = Username',
            },
            {
              customId: 'authorIcon',
              label: 'Author icon (*.webp)',
              placeholder: '{avatar} = User avatar, {iconURL} = Server icon',
            },
          ])
        );
      },
      title: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'title',
              label: 'Embed Title',
              placeholder: '{guild} = Server name, {user} = Username',
              required: true,
            },
          ])
        );
      },
      description: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'description',
              label: 'Description',
              placeholder: 'Enter the embed description\n{guild} = Server name\n{user} = Username',
              style: TextInputStyle.Paragraph,
              required: true,
            },
          ])
        );
      },
      color: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'color',
              label: 'Color (Empty = Random)',
              placeholder: Object.keys(Colors).join(',').slice(14, 114),
            },
          ])
        );
      },
      image: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'image',
              label: 'Image (Empty = Delete)',
              placeholder: 'Enter the image url, Empty = Delete',
            },
          ])
        );
      },
      thumbnail: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'thumbnail',
              label: 'Thumbnail (Empty = Delete)',
              placeholder: 'Enter the thumbnail url, Empty = Delete',
            },
          ])
        );
      },
      footer: async () => {
        return await interaction.showModal(
          createModal([
            {
              customId: 'footer',
              label: 'Footer (Empty = Delete)',
              placeholder: '{guild} = Server name, {user} = Username',
            },
            {
              customId: 'footerIcon',
              label: 'Footer icon (*.webp)',
              placeholder: '{avatar} = User avatar, {iconURL} = Server icon',
            },
          ])
        );
      },
      timestamp: async () => {
        if (Button1.components[2].data.style === ButtonStyle.Danger) {
          editEmbed.setTimestamp(null);
          Button1.components[2].setLabel('✅Timestamp').setStyle(ButtonStyle.Success);
        } else {
          editEmbed.setTimestamp();
          Button1.components[2].setLabel('⛔Timestamp').setStyle(ButtonStyle.Danger);
        }

        return await interaction.update({
          embeds: [editEmbed],
          components: [Button0, Button1],
          flags: 64,
        });
      },
      send: async () => {
        try {
          for (const button of [...Button0.components, ...Button1.components]) button.data.disabled = true;

          if (!messageId || messageId === 'undefined') {
            await channel.send({ embeds: [editEmbed] });
            await interaction.update({ components: [Button0, Button1] });
          } else {
            const msg = await channel.messages.fetch(messageId);
            if (!msg)
              return await interaction.reply(errorEmbed({ desc: 'Không tìm thấy message hoặc không ở channel này.' }));

            await msg.edit({ embeds: [editEmbed] }).catch(console.error);
            return await interaction.update({
              embeds: [
                {
                  title: '\\✅ Update successfully!',
                  description: `Message đã được update thành công.\n\n[Jump to message](${msg.url})`,
                },
              ],
              components: [Button0, Button1],
            });
          }
        } catch (e) {
          catchError(interaction, e, 'Error while updating embed message');
        }
      },
    };

    if (!showModal[button]) throw new Error(chalk.yellow("Invalid button's customId ") + chalk.green(button));

    return await showModal[button]();
  },
};
