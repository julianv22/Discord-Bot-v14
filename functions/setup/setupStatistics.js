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
const { dashboardMenu, textDisplay, sectionComponents, rowComponents } = require('../common/components');
const { embedMessage } = require('../common/logging');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Sets up the server statistics channels.
   * @param {Interaction} interaction - The command interaction. */
  client.setupStatistics = async (interaction) => {
    const { guild, guildId } = interaction;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);

    if (!profile)
      return await interaction.reply(embedMessage({ desc: 'No data found for this server. Please try again later!' }));

    const { totalChannelId, memberChannelId, botChannelId, presenceChannelId } = profile?.statistics || {};

    /** @param {string} channelId - The ID of the channel. */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📊 Statistics Information',
            `- Total Count Channel: ${channelName(totalChannelId)}\n- Members Count Channel: ${channelName(
              memberChannelId
            )}\n- Bots Count Channel: ${channelName(botChannelId)}\n- Presences Statistic Channel: ${channelName(
              presenceChannelId
            )}`,
          ],
          cfg.infoPNG,
          ComponentType.Thumbnail
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('### \\⚙️ Setup \\⤵️'))
      .addActionRowComponents(
        rowComponents(
          ComponentType.ChannelSelect,
          {
            customId: 'statistics-menu:totalcount',
            placeholder: '🌏 Select Total Count Channel',
          },
          ChannelType.GuildVoice
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        rowComponents(
          ComponentType.ChannelSelect,
          {
            customId: 'statistics-menu:membercount',
            placeholder: '🌏 Select Members Count Channel',
          },
          ChannelType.GuildVoice
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        rowComponents(
          ComponentType.ChannelSelect,
          {
            customId: 'statistics-menu:botcount',
            placeholder: '🌏 Select Bots Count Channel',
          },
          ChannelType.GuildVoice
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        rowComponents(
          ComponentType.ChannelSelect,
          {
            customId: 'statistics-menu:presence',
            placeholder: '🌏 Select Presences Statistic Channel',
          },
          ChannelType.GuildVoice
        )
      );

    await interaction.editReply({ components: [dashboardMenu('statistics'), container] });
  };
};
