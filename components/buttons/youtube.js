const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { createModal } = require('../../functions/common/components');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  type: 'buttons',
  data: { name: 'youtube' },
  /** - YouTube Subscribe Channels
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guildId, message, customId } = interaction;
    const { checkVideos } = client;
    const { components } = message;
    const [, buttonId, type] = customId.split(':');

    /** @param {number} id Component index. `1 = Notify channel, 2 = Alert role`*/
    const textDisplay = (id) => components[0].components[0].components[id].data;

    const onClick = {
      channel: async () =>
        await createModal(interaction, `youtube:${type}`, `${type.toCapitalize()} YouTube Channel`, {
          customId: type,
          label: 'YouTube ChannelID',
          placeholder: 'Enter the YouTube ChannelID',
          maxLength: 256,
          required: true,
        }),
      remove: async () => {
        await interaction.deferUpdate();

        switch (type) {
          case 'notify':
            textDisplay(1).content = '- \\💬 Notification Channel: \u274C\uFE0F Not set';
            await serverProfile
              .findOneAndUpdate({ guildId }, { $set: { 'youtube.notifyChannelId': '' } })
              .catch(console.error);
            break;

          case 'alert':
            textDisplay(2).content = '- \\🔔 Alert Role: \u274C\uFE0F Not set';
            await serverProfile
              .findOneAndUpdate({ guildId }, { $set: { 'youtube.alertRoleId': '' } })
              .catch(console.error);
            break;
          default:
            throw new Error(chalk.yellow('Invalid remove type'), chalk.green(type));
        }

        await interaction.editReply({ components });
      },
      refresh: async () => {
        await checkVideos();
        await interaction.reply(embedMessage({ desc: 'Successfully refreshed YouTube notifications!', emoji: true }));
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow('Invalid buttonId'), chalk.green(buttonId));
  },
};
