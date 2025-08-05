const {
  Client,
  Interaction,
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  Colors,
} = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
const { rowComponents } = require('../../../functions/common/components');
const { embedMessage } = require('../../../functions/common/logging');
const { getChannelTitle } = require('../../../functions/common/serverAnalyst');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('channel'),
  /** - Manages YouTube channels for notifications.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { guild, guildId } = interaction;
    const { name: guildName } = guild;

    const profile = await serverProfile
      .findOneAndUpdate({ guildId }, { guildName, prefix }, { upsert: true, new: true })
      .catch(console.error);
    if (!profile)
      return await interaction.editReply(embedMessage({ desc: 'No data found for this server. Try again later!' }));

    const { youtube } = profile || {};
    const channelList = await Promise.all(
      youtube?.channels?.map(async (channelId, id) => {
        const title = await getChannelTitle(channelId, process.env.YT_API_KEY);
        return `${id + 1}. [**${title}**](https://www.youtube.com/channel/${channelId}) - \`${channelId}\``;
      })
    );

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkAqua)
        .setThumbnail(cfg.youtubePNG)
        .setAuthor({
          name: 'YouTube Channels Subscribed List',
          iconURL: cfg.youtubeIcon,
        })
        .setDescription(channelList.length > 0 ? channelList.join('\n') : '-# No channel has been subscribed.'),
    ];

    const components = [
      new ActionRowBuilder().setComponents(
        rowComponents(ComponentType.Button, [
          { customId: 'youtube:channel:add', label: '➕ Add Channel', style: ButtonStyle.Success },
          { customId: 'youtube:channel:remove', label: '➖ Remove Channel', style: ButtonStyle.Danger },
          { customId: 'youtube:refresh', label: '🔄 Refesh', style: ButtonStyle.Primary },
        ])
      ),
    ];

    await interaction.editReply({ embeds, components });
  },
};
