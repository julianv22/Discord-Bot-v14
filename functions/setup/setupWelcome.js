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
const { dashboardMenu, textDisplay, sectionComponents, menuComponents } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the welcome system.
   * @param {Interaction} interaction - The command interaction. */
  client.setupWelcome = async (interaction) => {
    const { guild, guildId } = interaction;
    const { embedMessage } = client;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.followUp(
        embedMessage({ desc: 'No data found for this server. Please try again later!' })
      );

    const { welcome } = profile || {};
    const welcomeMessage = welcome?.message || '-# \u274C\uFE0F Not Set';

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### \\🎉 Welcome Information',
            `- \\💬 Welcome Channel: ${channelName(welcome?.channelId)}`,
            `- \\📋 Log Channel: ${channelName(welcome?.logChannelId)}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSectionComponents(
        sectionComponents(['- \\🗯 Welcome Message', welcomeMessage], ComponentType.Button, {
          customId: 'welcome-msg',
          label: '✍ Change Message',
          style: ButtonStyle.Success,
        })
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(menuComponents('welcome-menu:welcomechannel', '💬 Select Welcome Channel'))
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(menuComponents('welcome-menu:logchannel', '📋 Select Log Channel'));

    await interaction.editReply({
      components: [dashboardMenu('welcome'), container],
    });
  };
};
