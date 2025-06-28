const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('setup'),
  /** - Setup Youtube channel
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed } = client;
    const yt_channel = options.getString('channel-id');
    const action = options.getString('action');
    /** - Validate Youtube channel
     * @param {string} channelId - ID of the Youtube channel
     * @param {string} apiKey - API key for Youtube
     * @returns {Promise<{ valid: boolean, title: string | null }>}
     */
    const validateYoutubeChannel = async (channelId, apiKey) => {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        return { valid: true, title: data.items[0].snippet.title };
      }
      return { valid: false, title: null };
    };

    // Xác thực channel ID và lấy tên kênh
    const { valid, title } = await validateYoutubeChannel(yt_channel, process.env.YT_API_KEY);
    if (!valid) {
      return await interaction.reply(errorEmbed({ desc: 'ID kênh Youtube không hợp lệ hoặc không tồn tại!' }));
    }

    if (action === 'add') {
      // Check for existence first to provide a clean error message
      const existing = await serverProfile.findOne({ guildID: guild.id, 'youtube.channels': yt_channel });
      if (existing) {
        return await interaction.reply(
          errorEmbed({
            desc: `Kênh **[${title}](https://www.youtube.com/channel/${yt_channel})** đã tồn tại trong danh sách theo dõi.`,
          })
        );
      }

      // Use $addToSet to add the channel if it doesn't exist, and upsert to create the server profile if it doesn't exist.
      await serverProfile
        .updateOne(
          { guildID: guild.id },
          {
            $addToSet: { 'youtube.channels': yt_channel },
            $setOnInsert: { guildName: guild.name }, // Only sets guildName on creation
          },
          { upsert: true }
        )
        .catch(console.error);
    } else if (action === 'remove') {
      const result = await serverProfile
        .updateOne({ guildID: guild.id }, { $pull: { 'youtube.channels': yt_channel } })
        .catch(console.error);

      // If no document was modified, the channel wasn't in the list.
      if (!result || result.modifiedCount === 0) {
        return await interaction.reply(
          errorEmbed({
            desc: `Kênh **[${title}](https://www.youtube.com/channel/${yt_channel})** không có trong danh sách theo dõi.`,
          })
        );
      }
    }

    // Success message for both actions
    return await interaction.reply(
      errorEmbed({
        desc: `Đã ${
          action === 'add' ? 'thêm' : 'xoá'
        } thành công kênh **[${title}](https://www.youtube.com/channel/${yt_channel})** ${
          action === 'add' ? 'vào' : 'khỏi'
        } danh sách theo dõi của server.`,
        emoji: true,
      })
    );
  },
};
