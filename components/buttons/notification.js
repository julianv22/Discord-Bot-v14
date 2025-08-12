const { Client, Interaction, EmbedBuilder, ActionRowBuilder, TextInputStyle, Colors } = require('discord.js');
const { createModal, linkButton } = require('../../functions/common/components');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  type: 'buttons',
  data: { name: 'notification' },
  /** Handles the interaction for managing embeds.
   * @param {Interaction} interaction Button Interaction
   * @param {Client} client The Discord client. */
  async execute(interaction, client) {
    const { message, channel, customId } = interaction;
    const [, buttonId] = customId.split(':');
    const embed = EmbedBuilder.from(message.embeds[0]);
    const actionRows = ActionRowBuilder.from(message.components[0]);

    /** @param {object|object[]} options TextInputBuilder options */
    const showModal = async (options) =>
      await createModal(interaction, `manage-message:${buttonId}`, 'Notification Manager', options);

    const placeholder = `Enter the Notification ${buttonId}`;

    const onClick = {
      title: () =>
        showModal({
          customId: buttonId,
          label: 'Notification Title (Leave blank = Remove)',
          placeholder,
          maxLength: 256,
        }),
      description: () =>
        showModal({
          customId: buttonId,
          label: 'Notification Description',
          value: embed.data.description,
          placeholder,
          style: TextInputStyle.Paragraph,
          required: true,
        }),
      color: () =>
        showModal({
          customId: buttonId,
          label: 'Notification Color (Leave blank = Random)',
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
          maxLength: 256,
        }),
      image: () =>
        showModal([
          { customId: buttonId, label: 'Notification Image (Leave blank = Remove)', maxLength: 256, placeholder },
        ]),
      thumbnail: async () => {
        await interaction.deferUpdate();
        const thumbnailButton = actionRows.components[3];

        if (thumbnailButton.data.label === '📢 Type: Notify') {
          embed.setThumbnail(cfg.updatePNG);
          thumbnailButton.setLabel('📢 Type: Update');
        } else {
          embed.setThumbnail(cfg.notifyPNG);
          thumbnailButton.setLabel('📢 Type: Notify');
        }

        await interaction.editReply({ embeds: [embed], components: [actionRows] });
      },
      send: async () => {
        for (const button of actionRows.components) button.setDisabled(true);

        const msg = await channel.send({ embeds: [embed] });

        await interaction.update({
          ...embedMessage({ desc: 'Notification message has been sent', emoji: true }),
          components: [linkButton(msg.url)],
        });
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow("Invalid button's customId"), chalk.green(buttonId));
  },
};
