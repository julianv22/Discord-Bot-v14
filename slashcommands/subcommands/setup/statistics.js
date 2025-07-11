const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  MessageFlags,
  ComponentType,
  ChannelType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { sectionComponents, channelSelectMenu, textDisplay } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('statistics'),
  /** - Sets up channels for server statistics.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild } = interaction;
    const { id: guildID, name: guildName } = guild;

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);

    if (!profile) profile = await serverProfile.create({ guildID, guildName, prefix }).catch(console.error);

    const { totalChannel, memberChannel, botChannel, presenceChannel } = profile.statistics;

    /** @param {string} channelId */
    const channelName = (channelId) => guild.channels.cache.get(channelId) || '\\❌ Not Set';

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkGreen)
      .addSectionComponents(
        sectionComponents(
          [
            '### Setup Statistics',
            `- Total count channel: ${channelName(totalChannel)}\n- Members count channel: ${channelName(
              memberChannel
            )}\n- Bots count channel: ${channelName(botChannel)}\n- Presences statistic channel: ${channelName(
              presenceChannel
            )}`,
          ],
          ComponentType.Thumbnail,
          guild.iconURL(true)
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Total count channel:'))
      .addActionRowComponents(channelSelectMenu('statistic:total', ChannelType.GuildVoice))
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Members count channel:'))
      .addActionRowComponents(channelSelectMenu('statistic:members', ChannelType.GuildVoice))
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Bots count channel:'))
      .addActionRowComponents(channelSelectMenu('statistic:bots', ChannelType.GuildVoice))
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(textDisplay('Select Presences statistic channel:'))
      .addActionRowComponents(channelSelectMenu('statistic:presence', ChannelType.GuildVoice));

    await interaction.reply({ flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral], components: [container] });
  },
};
