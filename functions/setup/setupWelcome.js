const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ButtonStyle,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { sectionComponents, menuComponents, textDisplay, dashboardMenu } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupWelcome = async (interaction) => {
    const {
      guild,
      guildId,
      guild: { name: guildName },
    } = interaction;

    let profile = await serverProfile.findOne({ guildId }).catch(console.error);
    if (!profile)
      profile = await serverProfile.create({ guildId, guildName, prefix, welcome: {} }).catch(console.error);

    const { welcome } = profile || {};
    const welcomeMessage = welcome?.message || '-# \\❌ Not Set';

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \\🎉 Welcome Information',
            `- \\💬 Welcome channel: ${channelName(welcome?.channelId)}`,
            `- \\📋 Log channel: ${channelName(welcome?.logChannelId)}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSectionComponents(
        sectionComponents(['- \\🗯 Welcome message', welcomeMessage], ComponentType.Button, {
          customId: 'welcome-msg',
          label: '✍ Change message',
          style: ButtonStyle.Success,
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(menuComponents('welcome-menu:welcomechannel', '💬 Select Welcome Channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('welcome-menu:logchannel', '📋 Select Log Channel'));

    await interaction.editReply({
      components: [dashboardMenu(), container],
    });
  };
};
