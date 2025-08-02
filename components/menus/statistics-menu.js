const { Client, Interaction } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'statistics-menu' },
  /** - Statistics channel select menu
   * @param {Interaction} interaction Select Menu Interaction
   * @param {Client} client Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guild, guildId, message, values, customId } = interaction;
    const { serverStats } = client;
    const { components } = message;
    const { channels } = guild;
    const [, selected] = customId.split(':');
    const statisticInfo = components[1].components[0].components[1].data;
    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    const { statistics } = profile || {};

    const onSelect = {
      totalcount: () => (statistics.totalChannelId = values[0]),
      membercount: () => (statistics.memberChannelId = values[0]),
      botcount: () => (statistics.botChannelId = values[0]),
      presence: () => (statistics.presenceChannelId = values[0]),
    };

    if (!onSelect[selected]()) throw new Error(chalk.yellow('Invalid selected', chalk.green(selected)));

    await profile.save().catch(console.error);
    await serverStats(guildId);

    /** @param {string} channelId */
    const channelName = (channelId) => channels.cache.get(channelId) || '\u274C\uFE0F Not Set';

    statisticInfo.content = `- Total count channel: ${channelName(
      statistics?.totalChannelId
    )}\n- Members count channel: ${channelName(statistics?.memberChannelId)}\n- Bots count channel: ${channelName(
      statistics?.botChannelId
    )}\n- Presences statistic channel: ${channelName(statistics?.presenceChannelId)}`;

    await interaction.editReply({ components });
  },
};
