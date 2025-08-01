const {
  Client,
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  TextInputStyle,
  Colors,
} = require('discord.js');
const { createModal, linkButton } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'manage-message' },
  /** - Handles the interaction for managing embeds.
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    const { message, channel, customId } = interaction;
    const { embedMessage, catchError } = client;
    const [, buttonId, messageId] = customId.split(':');
    const editEmbed = EmbedBuilder.from(message.embeds[0]);
    const actionRow = (id) => ActionRowBuilder.from(message.components[id]);
    const actionRows = [actionRow(0), actionRow(1), actionRow(2)];

    if (!message) return await interaction.reply(embedMessage({ desc: 'Message not found or has been deleted!' }));

    const onClick = {
      author: async () =>
        await createModal(interaction, customId, 'Embed Manager', [
          {
            customId: buttonId,
            label: 'Author (Leave blank = Remove)',
            placeholder: '{guild} = Server Name, {user} = User Name',
            maxLength: 256,
          },
          {
            customId: 'authorIcon',
            label: 'Author Icon',
            placeholder: '{avatar} = User Avatar, {iconURL} = Server Icon',
            maxLength: 256,
          },
        ]),
      title: async () =>
        await createModal(interaction, customId, 'Embed Manager', {
          customId: buttonId,
          label: 'Embed Title (Leave blank = Remove)',
          value: editEmbed.data.title,
          placeholder: '{guild} = Server Name, {user} = User Name',
          maxLength: 256,
        }),
      description: async () =>
        await createModal(interaction, customId, 'Embed Manager', {
          customId: buttonId,
          label: 'Embed Description',
          value: editEmbed.data.description,
          placeholder: 'Enter embed description\n{guild} = Server Name\n{user} = User Name',
          style: TextInputStyle.Paragraph,
          required: true,
        }),
      color: async () =>
        await createModal(interaction, customId, 'Embed Manager', {
          customId: buttonId,
          label: 'Embed Color (Leave blank = Random)',
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
          maxLength: 256,
        }),
      image: async () =>
        await createModal(interaction, customId, 'Embed Manager', {
          customId: buttonId,
          label: 'Embed Image (Leave blank = Remove)',
          placeholder: 'Enter image URL, Leave blank = Remove',
          maxLength: 256,
        }),
      thumbnail: async () =>
        await createModal(interaction, customId, 'Embed Manager', {
          customId: buttonId,
          label: 'Embed Thumbnail (Leave blank = Remove)',
          placeholder: 'Enter thumbnail URL, Leave blank = Remove',
          maxLength: 256,
        }),
      footer: async () =>
        await createModal(interaction, customId, 'Embed Manager', [
          {
            customId: buttonId,
            label: 'Footer (Leave blank = Remove)',
            placeholder: '{guild} = Server Name, {user} = User Name',
            maxLength: 2048,
          },
          {
            customId: buttonId + 'Icon',
            label: 'Footer Icon',
            placeholder: '{avatar} = User Avatar, {iconURL} = Server Icon',
            maxLength: 256,
          },
        ]),
      timestamp: async () => {
        await interaction.deferUpdate();
        const timestampButton = actionRows[1].components[0];

        if (timestampButton.data.style === ButtonStyle.Danger) {
          editEmbed.setTimestamp(null);
          timestampButton.setLabel('✅ Timestamp').setStyle(ButtonStyle.Success);
        } else {
          editEmbed.setTimestamp();
          timestampButton.setLabel('⛔ Timestamp').setStyle(ButtonStyle.Danger);
        }

        await interaction.editReply({ embeds: [editEmbed], components: actionRows });
      },
      addfield: async () =>
        await createModal(interaction, customId, 'Embed Manager', [
          { customId: buttonId, label: 'Field name', placeholder: 'Enter field name', maxLength: 256, required: true },
          {
            customId: 'fieldvalue',
            label: 'Field value',
            placeholder: 'Enter field value',
            maxLength: 1024,
            required: true,
          },
          {
            customId: 'inline',
            label: 'Inline (0 = false, 1 = true)',
            placeholder: '0 = false, 1 = true',
            maxLength: 1,
          },
        ]),
      removefields: async () => {
        await interaction.deferUpdate();
        await interaction.editReply({ embeds: [editEmbed.setFields()] });
      },
      send: async () => {
        try {
          // If !messageId then send new embed
          if (!messageId || messageId === 'undefined') {
            // Disable all buttons
            for (const actionRow of actionRows) {
              for (const button of actionRow.components) button.setDisabled(true);
            }

            // editEmbed.setFields();
            await channel.send({ embeds: [editEmbed] });
            await interaction.update({ components: actionRows });
          } else {
            const msg = await channel.messages.fetch(messageId);
            if (!msg)
              return await interaction.reply(
                embedMessage({ desc: 'Message not found or message is not in this channel.' })
              );

            await msg.edit({ embeds: [editEmbed] }).catch(console.error);
            await interaction.update({
              embeds: [
                {
                  author: {
                    name: 'Message has been updated successfully!',
                    iconURL: cfg.verified_gif,
                  },
                },
              ],
              components: [linkButton(msg.url)],
            });
          }
        } catch (e) {
          return await catchError(interaction, e, 'Error while updating embed message');
        }
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow("Invalid button's customId"), chalk.green(buttonId));
  },
};
