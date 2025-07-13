const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  MessageFlags,
  ComponentType,
  ButtonStyle,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { textDisplay, sectionComponents, rowComponents } = require('../../../functions/common/components');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('channel'),
  /** - Manages YouTube channels for notifications.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { guild, guildId: guildID } = interaction;

    /** - Gets the title of a YouTube channel.
     * @param {string} channelId - The ID of the YouTube channel.
     * @param {string} apiKey - The API key for YouTube. */
    const getChannelTitle = async (channelId, apiKey) => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
          res = await fetch(url),
          data = await res.json();

        if (data.items && data.items.length > 0) return data.items[0].snippet.title;
      } catch (e) {
        console.error(chalk.red('Error while executing function getChannelTitle:\n'), e);
      }
      return channelId;
    };

    let profile = await serverProfile.findOne({ guildID }).catch(console.error);
    if (!profile)
      profile = await serverProfile
        .create({ guildID, guildName, prefix, youtube: { channels: [], lastVideos: [] } })
        .catch(console.error);

    const { youtube } = profile;
    const channelList = await Promise.all(
      youtube.channels.map(async (id, idx) => {
        const title = await getChannelTitle(id, process.env.YT_API_KEY);
        return `${idx + 1}. [${title}](https://www.youtube.com/channel/${id}) - \`${id}\``;
      })
    );

    const container = new ContainerBuilder()
      .setAccentColor(Colors.DarkAqua)
      .addSectionComponents(
        sectionComponents(
          [
            '### 📢 Subscribed YouTube Channels',
            channelList.length > 0 ? channelList.join('\n') : '-# No channel has been subcribed.',
          ],
          ComponentType.Thumbnail,
          {
            iconURL: guild.iconURL(true),
          }
        )
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addActionRowComponents(
        new ActionRowBuilder().setComponents(
          rowComponents(
            [
              { customId: 'youtube:add', label: 'Add Channel', emoji: '➕', style: ButtonStyle.Success },
              { customId: 'youtube:remove', label: 'Remove Channel', emoji: '➖', style: ButtonStyle.Danger },
            ],
            ComponentType.Button
          )
        )
      );

    await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [container],
    });
  },
};
