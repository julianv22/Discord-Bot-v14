const { Client, ChannelSelectMenuInteraction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'statistic-menu' },
  /** - Statistics channel select menu
   * @param {ChannelSelectMenuInteraction} interaction Channel Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    const {
      guild,
      message: { components },
      customId,
      values,
    } = interaction;
    const { serverStats } = client;
    const [, selected] = customId.split(':');
    const channelId = values[0];
    const statisticInfo = components[0].components[0].components[1].data;
    const guildID = guild.id;
    const profile = await serverProfile.findOne({ guildID }).catch(console.error);
    const { statistics } = profile;

    const onClick = {
      total: () => {
        statistics.totalChannel = channelId;
        return true;
      },
      members: () => {
        statistics.memberChannel = channelId;
        return true;
      },
      bots: () => {
        statistics.botChannel = channelId;
        return true;
      },
      presence: () => {
        statistics.presenceChannel = channelId;
        return true;
      },
    };

    if (!onClick[selected]()) return;

    await profile.save().catch(console.error);
    await serverStats(guildID);

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    statisticInfo.content = `- Total count channel: ${channelName(
      statistics.totalChannel
    )}\n- Members count channel: ${channelName(statistics.memberChannel)}\n- Bots count channel: ${channelName(
      statistics.botChannel
    )}\n- Presences statistic channel: ${channelName(statistics.presenceChannel)}`;

    await interaction.update({ components });
  },
};
