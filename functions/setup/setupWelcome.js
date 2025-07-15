const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ButtonStyle,
  MessageFlags,
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
      message: { components },
    } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, setup: { welcome: { channel: '', log: '', message: '' } } })
        .catch(console.error);

    const { welcome } = profile?.setup || {};
    const welcomeMessage = welcome?.message || '-# \\❌ Not Set';

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### Welcome Information',
            `- \\💬 Welcome channel: ${channelName(welcome?.channel)}`,
            `- \\💬 Log channel: ${channelName(welcome?.log)}`,
          ],
          ComponentType.Thumbnail,
          { url: guild.iconURL(true) }
        )
      )
      .addSectionComponents(
        sectionComponents(`- \\📝 Welcome message:\n${welcomeMessage}`, ComponentType.Button, {
          customId: 'welcome-msg',
          label: '📝 Change message',
          style: ButtonStyle.Success,
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### Select channels \\⤵️'))
      .addActionRowComponents(menuComponents('welcome-menu:channel', 'Select Welcome channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('welcome-menu:log', 'Select Log channel'));

    await interaction.editReply({
      components: [dashboardMenu(), container],
    });
  };
};
