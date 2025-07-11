const { Client, ChannelSelectMenuInteraction, MessageFlags } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  type: 'menus',
  data: { name: 'statistic' },
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
        return;
      },
      members: () => {
        statistics.memberChannel = channelId;
        return;
      },
      bots: () => {
        statistics.botChannel = channelId;
        return;
      },
      presence: () => {
        statistics.presenceChannel = channelId;
        return;
      },
    };
    onClick[selected]();

    await profile.save().catch(console.error);

    serverStats(guildID);

    statisticInfo.content = `- Total count channel: <#${statistics.totalChannel}>)\n- Members count channel: <#${statistics.memberChannel}>\n- Bots count channel: <#${statistics.botChannel}>\n- Presences statistic channel: <#${statistics.presenceChannel}>`;

    await interaction.update({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components });
  },
};
