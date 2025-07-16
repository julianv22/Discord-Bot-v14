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
    const { guild } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);

    if (!profile)
      profile = await serverProfile
        .create({
          guildID,
          guildName,
          prefix,
          statistics: { totalChannel: '', memberChannel: '', botChannel: '', presenceChannel: '' },
        })
        .catch(console.error);

    const { totalChannel, memberChannel, botChannel, presenceChannel } = profile?.statistics || {};

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📊 Statistics Information',
            `- Total count channel: ${channelName(totalChannel)}\n- Members count channel: ${channelName(
              memberChannel
            )}\n- Bots count channel: ${channelName(botChannel)}\n- Presences statistic channel: ${channelName(
              presenceChannel
            )}`,
          ],
          ComponentType.Thumbnail,
          cfg.infoPNG
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(
        menuComponents('statistic-menu:total', '🌏 Select Total count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:members', '🤵 Select Members count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:bots', '🎯 Select Bots count channel', ChannelType.GuildVoice)
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        menuComponents('statistic-menu:presence', '📊 Select presences statistic channel', ChannelType.GuildVoice)
      );

    await interaction.editReply({ components: [dashboardMenu(), container] });
  };
};
