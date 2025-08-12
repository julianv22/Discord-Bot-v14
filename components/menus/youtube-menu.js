const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'youtube-menu' },
  /** Setup YouTube notification channel and alert role
   * @param {Interaction} interaction Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guildId, message, values, customId } = interaction;
    const { components } = message;
    const [, selected] = customId.split(':');
    const notifySection = components[0].components[0].components[1].data;
    const alertSection = components[0].components[0].components[2].data;

    const onClick = {
      notify: async () => {
        notifySection.content = `- Notify channel: <#${values[0]}>`;
        await serverProfile
          .findOneAndUpdate({ guildId }, { $set: { 'youtube.notifyChannelId': values[0] } })
          .catch(console.error);
      },
      alert: async () => {
        alertSection.content = `- Alert role: <@&${values[0]}>`;
        await serverProfile
          .findOneAndUpdate({ guildId }, { $set: { 'youtube.alertRoleId': values[0] } })
          .catch(console.error);
      },
    };

    if (!onClick[selected]()) throw new Error(chalk.yellow('Invalid selected', chalk.green(selected)));
    await interaction.editReply({ components });
  },
};
