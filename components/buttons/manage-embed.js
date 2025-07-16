const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'manage-embed' },
  /** - Handles the interaction for managing embeds.
   * @param {Interaction} interaction - The button interaction.
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    const { customId, message, channel } = interaction;
    const { errorEmbed, catchError } = client;
    const [, buttonId, messageId] = customId.split(':');
    const editEmbed = EmbedBuilder.from(message.embeds[0]);
    const actionRow = (id) => ActionRowBuilder.from(message.components[id]);
    const buttons = [actionRow(0), actionRow(1), actionRow(2)];
    // [button1, button2, button3]
    if (!message) return await interaction.reply(errorEmbed({ desc: 'Message not found!' }));

    /** - Creates an interaction modal.
     * @param {object[]} options - Array of options for text inputs. */
    const createModal = (options) => {
      const textInputs = rowComponents(options, ComponentType.TextInput);
      const actionRows = textInputs.map((textInput) => new ActionRowBuilder().addComponents(textInput));
      const modal = new ModalBuilder().setCustomId(customId).setTitle('Embed Manager');
      actionRows.forEach((row) => modal.addComponents(row));
      return modal;
    };

    const onClick = {
      author: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Author (Leave blank = Remove)',
              placeholder: '{guild} = Server Name, {user} = User Name',
            },
            {
              customId: 'authorIcon',
              label: 'Author Icon',
              placeholder: '{avatar} = User Avatar, {iconURL} = Server Icon',
            },
          ])
        ),
      title: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Embed Title (Leave blank = Remove)',
              value: editEmbed.data.title,
              placeholder: '{guild} = Server Name, {user} = User Name',
            },
          ])
        ),
      description: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Embed Description',
              value: editEmbed.data.description,
              placeholder: 'Enter embed description\n{guild} = Server Name\n{user} = User Name',
              style: TextInputStyle.Paragraph,
              required: true,
            },
          ])
        ),
      color: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Embed Color (Leave blank = Random)',
              placeholder: Object.keys(Colors).join(',').slice(14, 114),
            },
          ])
        ),
      image: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Embed Image (Leave blank = Remove)',
              placeholder: 'Enter image URL, Leave blank = Remove',
            },
          ])
        ),
      thumbnail: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Embed Thumbnail (Leave blank = Remove)',
              placeholder: 'Enter thumbnail URL, Leave blank = Remove',
            },
          ])
        ),
      footer: async () =>
        await interaction.showModal(
          createModal([
            {
              customId: buttonId,
              label: 'Footer (Leave blank = Remove)',
              placeholder: '{guild} = Server Name, {user} = User Name',
            },
            {
              customId: buttonId + 'Icon',
              label: 'Footer Icon',
              placeholder: '{avatar} = User Avatar, {iconURL} = Server Icon',
            },
          ])
        ),
      timestamp: async () => {
        const timestampButton = buttons[1].components[0];

        if (timestampButton.data.style === ButtonStyle.Danger) {
          editEmbed.setTimestamp(null);
          timestampButton.setLabel('✅ Timestamp').setStyle(ButtonStyle.Success);
        } else {
          editEmbed.setTimestamp();
          timestampButton.setLabel('⛔ Timestamp').setStyle(ButtonStyle.Danger);
        }

        return await interaction.update({ embeds: [editEmbed], components: buttons });
      },
      addfield: async () =>
        await interaction.showModal(
          createModal([
            { customId: buttonId, label: 'Field name', placeholder: 'Enter field name', required: true },
            { customId: 'fieldvalue', label: 'Field value', placeholder: 'Enter field value', required: true },
            { customId: 'inline', label: 'Inline (0 = false, 1 = true)', placeholder: '0 = false, 1 = true' },
          ])
        ),
      removefields: async () => await interaction.update({ embeds: [editEmbed.setFields()] }),
      send: async () => {
        try {
          // Disable all buttons
          for (const button of buttons) {
            for (const component of button.components) {
              component.data.disabled = true;
            }
          }

          if (!messageId || messageId === 'undefined') {
            // editEmbed.setFields();
            await channel.send({ embeds: [editEmbed] });
            return await interaction.update({ components: buttons });
          } else {
            const msg = await channel.messages.fetch(messageId);
            if (!msg)
              return await interaction.reply(
                errorEmbed({ desc: 'Message not found or message is not in this channel.' })
              );

            await msg.edit({ embeds: [editEmbed] }).catch(console.error);
            return await interaction.update({
              embeds: [
                {
                  author: { name: '✅ Successfully Updated!' },
                  description: `Message has been successfully updated.`,
                },
              ],
              components: [
                new ActionRowBuilder().setComponents(
                  new ButtonBuilder().setLabel('🔗 Go to message').setStyle(ButtonStyle.Link).setURL(msg.url)
                ),
              ],
            });
          }
        } catch (e) {
          return catchError(interaction, e, 'Error while updating embed message');
        }
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow("Invalid button's customId"), chalk.green(buttonId));
  },
};
