const {
  Client,
  Interaction,
  ContainerBuilder,
  SeparatorBuilder,
  ComponentType,
  ChannelType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { sectionComponents, menuComponents, textDisplay, dashboardMenu } = require('../common/components');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Setup welcome
   * @param {Interaction} interaction - Command Interaction. */
  client.setupStats = async (interaction) => {
    const {
      guild,
      guildId,
      guild: { name: guildName },
    } = interaction;

    let profile = await serverProfile.findOne({ guildId }).catch(console.error);

    if (!profile)
      profile = await serverProfile.create({ guildId, guildName, prefix, statistics: {} }).catch(console.error);

    const { totalChannelId, memberChannelId, botChannelId, presenceChannelId } = profile?.statistics || {};

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📊 Statistics Information',
            `- Total count channel: ${channelName(totalChannelId)}\n- Members count channel: ${channelName(
              memberChannelId
            )}\n- Bots count channel: ${channelName(botChannelId)}\n- Presences statistic channel: ${channelName(
              presenceChannelId
            )}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(
        menuComponents('statistic-menu:totalcount', '🌏 Select Total count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:membercount', '🤵 Select Members count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:botcount', '🎯 Select Bots count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:presence', '📊 Select presences statistic channel', ChannelType.GuildVoice)
      );

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
