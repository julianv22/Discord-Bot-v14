const { Client, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('channel'),
  /** - Manages YouTube channels for notifications.
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed } = client;
    const { id: guildID, name: guildName } = guild;
    const yt_channel = options.getString('channel-id');
    const action = options.getString('action');
    /** - Validates a YouTube channel.
     * @param {string} channelId - The ID of the YouTube channel.
     * @param {string} apiKey - The API key for YouTube. */
    const validateYoutubeChannel = async (channelId, apiKey) => {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.items && data.items.length > 0) return { valid: true, title: data.items[0].snippet.title };

      return { valid: false, title: null };
    };

    // Xác thực channel ID và lấy tên kênh
    const { valid, title } = await validateYoutubeChannel(yt_channel, process.env.YT_API_KEY);
    if (!valid) return await interaction.reply(errorEmbed({ desc: 'Invalid or non-existent YouTube channel ID!' }));

    if (action === 'add') {
      // Check for existence first to provide a clean error message
      const existing = await serverProfile.findOne({ guildID, 'youtube.channels': yt_channel });
      if (existing)
        return await interaction.reply(
          errorEmbed({
            desc: `Channel **[${title}](https://www.youtube.com/channel/${yt_channel})** is already in the watchlist.`,
          })
        );

      // Use $addToSet to add the channel if it doesn't exist, and upsert to create the server profile if it doesn't exist.
      await serverProfile
        .updateOne(
          { guildID },
          {
            $addToSet: { 'youtube.channels': yt_channel },
            $setOnInsert: { guildName }, // Only sets guildName on creation
          },
          { upsert: true }
        )
        .catch(console.error);
    } else if (action === 'remove') {
      const result = await serverProfile
        .updateOne({ guildID }, { $pull: { 'youtube.channels': yt_channel } })
        .catch(console.error);

      // If no document was modified, the channel wasn't in the list.
      if (!result || result.modifiedCount === 0)
        return await interaction.reply(
          errorEmbed({
            desc: `Channel **[${title}](https://www.youtube.com/channel/${yt_channel})** is not in the watchlist.`,
          })
        );
    }

    // Success message for both actions
    return await interaction.reply(
      errorEmbed({
        desc: `Successfully ${
          action === 'add' ? 'added' : 'removed'
        } channel **[${title}](https://www.youtube.com/channel/${yt_channel})** ${
          action === 'add' ? 'to' : 'from'
        } the server's watchlist.`,
        emoji: true,
      })
    );
  },
};
