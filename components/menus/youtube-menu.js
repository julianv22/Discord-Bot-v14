const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'youtube-menu' },
  /** - Setup YouTube notification channel and alert role
   * @param {Interaction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guildId: guildID,
      message: { components },
      customId,
      values,
    } = interaction;
    const [, selected] = customId.split(':');
    const channelId = values[0];
    const notifySection = components[0].components[0].components[1].data;
    const alertSection = components[0].components[0].components[2].data;

    const onClick = {
      notify: async () => {
        notifySection.content = `- Notify channel: <#${channelId}>`;
        await serverProfile
          .findOneAndUpdate({ guildID }, { $set: { 'youtube.notifyChannel': channelId } })
          .catch(console.error);
      },
      alert: async () => {
        alertSection.content = `- Alert role: <@&${channelId}>`;
        await serverProfile
          .findOneAndUpdate({ guildID }, { $set: { 'youtube.alert': channelId } })
          .catch(console.error);
      },
    };

    if (!onClick[selected]()) throw new Error(chalk.yellow('Invalid selected', chalk.green(selected)));
    await interaction.update({ components });
  },
};
