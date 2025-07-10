const {
  Client,
  ButtonInteraction,
  ModalBuilder,
  ComponentType,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');
const { rowComponents } = require('../../functions/common/components');

module.exports = {
  type: 'buttons',
  data: { name: 'welcome-msg' },
  /** - Welcome message button
   * @param {ButtonInteraction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const modal = new ModalBuilder().setCustomId('welcome-msg').setTitle('Welcome message');
    const textinput = new ActionRowBuilder().setComponents(
      rowComponents(
        [
          {
            customId: 'welcome-msg',
            label: 'Nhập nội dung tin nhắn chào mừng',
            style: TextInputStyle.Paragraph,
            required: true,
          },
        ],
        ComponentType.TextInput
      )
    );

    modal.setComponents(textinput);

    await interaction.showModal(modal);
  },
};
