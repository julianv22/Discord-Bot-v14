const { Client, Interaction, EmbedBuilder, ActionRowBuilder, TextInputStyle, Colors } = require('discord.js');
const { createModal } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'notification' },
  /** - Handles the interaction for managing embeds.
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - The Discord client. */
  async execute(interaction, client) {
    const { customId, message } = interaction;
    const { errorEmbed, catchError } = client;
    const [, buttonId] = customId.split(':');
    const modalId = 'manage-embed:' + buttonId;
    const placeholder = `Enter the Notification ${buttonId}`;
    const embed = EmbedBuilder.from(message.embeds[0]);
    const buttons = ActionRowBuilder.from(message.components[0]);

    const onClick = {
      title: () =>
        createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Title (Leave blank = Remove)',
          placeholder,
          max_length: 256,
        }),
      description: () =>
        createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Description',
          value: embed.data.description,
          placeholder,
          style: TextInputStyle.Paragraph,
          required: true,
        }),
      color: () =>
        createModal(interaction, modalId, 'Notification Manager', {
          customId: buttonId,
          label: 'Notification Color (Leave blank = Random)',
          placeholder: Object.keys(Colors).join(',').slice(14, 114),
        }),
      image: () =>
        createModal(interaction, modalId, 'Notification Manager', [
          { customId: buttonId, label: 'Notification Image (Leave blank = Remove)', placeholder },
        ]),
      thumbnail: async () => {
        const thumbnailButton = buttons.components[3];

        if (thumbnailButton.data.label === '📢 Type: Notify') {
          embed.setThumbnail(cfg.updatePNG);
          thumbnailButton.setLabel('📢 Type: Update');
        } else {
          embed.setThumbnail(cfg.thongbaoPNG);
          thumbnailButton.setLabel('📢 Type: Notify');
        }

        await interaction.update({ embeds: [embed], components: [buttons] });
      },
      send: async () => {},
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow("Invalid button's customId"), chalk.green(buttonId));
  },
};
