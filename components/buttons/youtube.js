const { Client, Interaction, ModalBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const { rowComponents } = require('../../functions/common/components');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'youtube' },
  /** - YouTube Subscribe Channels
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const {
      customId,
      guildId,
      message: { components },
    } = interaction;
    const { checkVideos, errorEmbed } = client;
    const [, buttonId, type] = customId.split(':');

    /** @param {number} id Component index. `1 = Notify channel, 2 = Alert role`*/
    const textDisplay = (id) => components[0].components[0].components[id].data;

    const onClick = {
      channel: async () => {
        const textInput = [
          { customId: type, label: 'YouTube ChannelID', placeholder: 'Enter the YouTube ChannelID', required: true },
        ];

        const modal = new ModalBuilder()
          .setCustomId('youtube:' + type)
          .setTitle(`${type.toCapitalize()} YouTube Channel`)
          .setComponents(new ActionRowBuilder().setComponents(rowComponents(textInput, ComponentType.TextInput)));

        return await interaction.showModal(modal);
      },
      remove: async () => {
        switch (type) {
          case 'notify':
            textDisplay(1).content = '- \\💬 Notification Channel: \\❌ Not set';
            await serverProfile
              .findOneAndUpdate({ guildId }, { $set: { 'youtube.notifyChannelId': '' } })
              .catch(console.error);
            break;

          case 'alert':
            textDisplay(2).content = '- \\🔔 Alert Role: \\❌ Not set';
            await serverProfile
              .findOneAndUpdate({ guildId }, { $set: { 'youtube.alertRoleId': '' } })
              .catch(console.error);
            break;
          default:
            throw new Error(chalk.yellow('Invalid remove type'), chalk.green(type));
        }

        return await interaction.update({ components });
      },
      refresh: async () => {
        await checkVideos();
        return await interaction.reply(
          errorEmbed({ desc: 'Successfully refreshed YouTube notifications!', emoji: true })
        );
      },
    };

    if (!onClick[buttonId]()) throw new Error(chalk.yellow('Invalid buttonId'), chalk.green(buttonId));
  },
};
