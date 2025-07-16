const { Client, Interaction, ModalBuilder, ActionRowBuilder, ComponentType, TextInputStyle } = require('discord.js');
const { rowComponents } = require('../../functions/common/components');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'welcome-msg' },
  /** - Welcome message button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guildId: guildID } = interaction;
    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    const modal = new ModalBuilder().setCustomId('welcome-msg').setTitle('Welcome message');
    const textinput = new ActionRowBuilder().setComponents(
      rowComponents(
        [
          {
            customId: 'welcome-msg',
            label: 'Enter the welcome message',
            style: TextInputStyle.Paragraph,
            value: profile?.setup?.welcome?.message || '',
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
