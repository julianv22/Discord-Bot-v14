const { Client, ChannelSelectMenuInteraction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'welcome-menu' },
  /** - Welcome channel select menu
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
    const channelId = values[0];
    const welcomeSection = components[0].components[0].components[1].data;
    const logSection = components[0].components[0].components[2].data;

    const setupWelcome = {
      channel: async () => {
        await serverProfile
          .findOneAndUpdate({ guildID }, { $set: { 'setup.welcome.channel': channelId } })
          .catch(console.error);
        welcomeSection.content = `- Welcome channel: <#${channelId}>`;
        return true;
      },
      log: async () => {
        await serverProfile
          .findOneAndUpdate({ guildID }, { $set: { 'setup.welcome.log': channelId } })
          .catch(console.error);
        logSection.content = `- Log channel: <#${channelId}>`;
        return true;
      },
    };

    if (!setupWelcome[selected]()) return;
    await interaction.update({ components });
  },
};
