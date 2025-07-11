const { Client, ChannelSelectMenuInteraction, MessageFlags } = require('discord.js');
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

    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    const { welcome } = profile.setup;

    const setupWelcome = {
      channel: () => {
        welcome.channel = channelId;
        welcomeSection.content = `- Welcome channel: <#${channelId}>`;
        return;
      },
      log: () => {
        welcome.log = channelId;
        logSection.content = `- Log channel: <#${channelId}>`;
        return;
      },
    };
    setupWelcome[selected]();

    await profile.save().catch(console.error);

    return await interaction.update({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components,
    });
  },
};
