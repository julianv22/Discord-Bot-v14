const { Client, ChannelSelectMenuInteraction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'youtube-menu' },
  /** - Setup YouTube notification channel and alert role
   * @param {ChannelSelectMenuInteraction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guildId: guildID,
      message: { components },
      customId,
      values,
    } = interaction;
    const [, selected] = customId.split(':');
    const selectValue = values[0];
    const notifySection = components[0].components[0].components[1].data;
    const alertSection = components[0].components[0].components[2].data;

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    const { youtube } = profile;

    const onClick = {
      notify: () => {
        youtube.notifyChannel = selectValue;
        notifySection.content = `- Notify channel: <#${selectValue}>`;
        return;
      },
      alert: () => {
        youtube.alert = selectValue;
        alertSection.content = `- Alert role: <@&${selectValue}>`;
        return;
      },
    };
    onClick[selected]();

    await profile.save().catch(console.error);

    await interaction.update({ components });
  },
};
