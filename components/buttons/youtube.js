const { Client, ButtonInteraction, ModalBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { rowComponents } = require('../../functions/common/components');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'youtube' },
  /** - YouTube Subscribe Channels
   * @param {ButtonInteraction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      customId,
      guildId: guildID,
      message: { components },
    } = interaction;
    const [, action] = customId.split(':');
    /** @param {number} idx component index. `1 = Notify channel, 2 = Alert role`*/
    const textDisplay = (idx) => components[0].components[0].components[idx].data;

    const onClick = {
      default: async () => {
        const textInput = [
          {
            customId: action,
            label: 'YouTube ChannelID',
            placeholder: 'Enter the YouTube ChannelID',
            required: true,
          },
        ];

        const modal = new ModalBuilder()
          .setCustomId(customId)
          .setTitle(`${action.toCapitalize()} YouTube Channel`)
          .setComponents(new ActionRowBuilder().setComponents(rowComponents(textInput, ComponentType.TextInput)));

        return await interaction.showModal(modal);
      },
      notify: async () => {
        await serverProfile
          .findOneAndUpdate({ guildID }, { $set: { 'youtube.notifyChannel': '' } })
          .catch(console.error);
        textDisplay(1).content = '- Notification Channel: \\❌ Not set';
        return await interaction.update({ components });
      },
      alert: async () => {
        await serverProfile.findOneAndUpdate({ guildID }, { $set: { 'youtube.alert': '' } }).catch(console.error);
        textDisplay(2).content = '- Alert Role: \\❌ Not set';
        return await interaction.update({ components });
      },
    };

    await (onClick[action] || onClick.default)();
  },
};
