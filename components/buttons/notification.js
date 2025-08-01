const { Client, Interaction, EmbedBuilder, ActionRowBuilder, TextInputStyle, Colors } = require('discord.js');
const { createModal, linkButton } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'notification' },
  /** - Handles the interaction for managing embeds.
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    const { message, channel, customId } = interaction;
    const { embedMessage } = client;
    const [, buttonId] = customId.split(':');
    const modalId = 'manage-message:' + buttonId;
    const placeholder = `Enter the Notification ${buttonId}`;
    const embed = EmbedBuilder.from(message.embeds[0]);
    const actionRows = ActionRowBuilder.from(message.components[0]);

    const onClick = {
      title: async () =>
        await createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Title (Leave blank = Remove)',
          placeholder,
          maxLength: 256,
        }),
      description: async () =>
        await createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Description',
          value: embed.data.description,
          placeholder,
          style: TextInputStyle.Paragraph,
          required: true,
        }),
      color: async () =>
        await createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Color (Leave blank = Random)',
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
          maxLength: 256,
        }),
      image: async () =>
        await createModal(interaction, modalId, 'Notification Manager', [
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
