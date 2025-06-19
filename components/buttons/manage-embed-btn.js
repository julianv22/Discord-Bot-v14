const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  TextInputStyle,
  ModalBuilder,
  Colors,
} = require('discord.js');
const { setTextInput } = require('../../functions/common/components');

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
    const getEmbeds = EmbedBuilder.from(message.embeds[0]);
    const [Button0, Button1] = [
      ActionRowBuilder.from(message.components[0]),
      ActionRowBuilder.from(message.components[1]),
    ];

    if (!message) return await interaction.reply(errorEmbed({ desc: 'No message found', emoji: false }));

    /** - Create modal
     * @param {object} options - Modal Components
     * @param {string} modalId - Modal custom ID
     * @param {string} modalTitle - Modal title
     * @returns {ModalBuilder} - Return ModalBuilder
     */
    const createModal = (options, modalId = `manage-embed-md:${button}`, modalTitle = 'Embed Manager') => {
      return new ModalBuilder().setCustomId(modalId).setTitle(modalTitle).setComponents(setTextInput(options));
    };

    try {
      const showModal = {
        author: async () => {
          const modal = createModal({
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
            createModal({
              id: 'title',
              label: 'Embed Title',
              placeholder: '{guild} = Server name, {user} = Username',
              required: true,
            }),
          );
        },
        description: async () => {
          return await interaction.showModal(
            createModal({
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
            createModal({
              id: 'color',
              label: 'Color (Empty = Random)',
              placeholder: Object.keys(Colors).join(',').slice(14, 114),
              required: true,
            }),
          );
        },
        image: async () => {
          return await interaction.showModal(
            createModal({
              id: 'image',
              label: 'Image (Empty = Delete)',
              placeholder: 'Enter the image url, Empty = Delete',
            }),
          );
        },
        thumbnail: async () => {
          return await interaction.showModal(
            createModal({
              id: 'thumbnail',
              label: 'Thumbnail (Empty = Delete)',
              placeholder: 'Enter the thumbnail url, Empty = Delete',
            }),
          );
        },
        footer: async () => {
          const modal = createModal({
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
          try {
            for (const button of [...Button0.components, ...Button1.components]) button.data.disabled = true;

            if (!messageId || messageId === 'undefined') {
              await channel.send({ embeds: [getEmbeds] });
              await interaction.update({ components: [Button0, Button1] });
            } else {
              const msg = await channel.messages.fetch(messageId);
              if (!msg)
                return await interaction.reply(
                  errorEmbed({ desc: 'Không tìm thấy message hoặc không ở channel này.', emoji: false }),
                );

              await msg.edit({ embeds: [getEmbeds] }).catch(console.error);
              return await interaction.update({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('\\✅ Update successfully!')
                    .setDescription(`Message đã được update thành công.\n\n[Jump to message](${msg.url})`),
                ],
                components: [Button0, Button1],
              });
            }
          } catch (e) {
            const error = 'Error while updating embed message\n';
            console.error(chalk.red(error), e);
            return await interaction.reply(errorEmbed({ title: `\\❌ ${error}`, desc: e, color: Colors.Red }));
          }
        },
      };

      if (!showModal[button]) throw new Error(chalk.yellow("Invalid button's customId ") + chalk.green(button));
      else return await showModal[button]();
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
