const { SlashCommandSubcommandBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');

module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('setup'),
  /**
   * Setup Youtube channel
   * @param {ChatInputCommandInteraction} interaction - Interaction object
   * @param {Client} client - Client
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;
    const { errorEmbed, catchError } = client;
    const [yt_channel, action] = [options.getString('channel-id'), options.getString('action')];
    /**
     * Validate Youtube channel
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

    try {
      // Xác thực channel ID và lấy tên kênh
      const { valid, title } = await validateYoutubeChannel(yt_channel, process.env.YT_API_KEY);
      if (!valid) {
        return await interaction.reply(
          errorEmbed({ desc: 'ID kênh Youtube không hợp lệ hoặc không tồn tại!', emoji: false }),
        );
      }

      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(console.error);
      const { youtube } = profile;
      if (!profile) {
        if (action === 'remove')
          return await interaction.reply(errorEmbed({ desc: 'Server chưa có kênh Youtube nào!', emoji: false }));
        profile = await serverProfile
          .create({
            guildID: guild.id,
            guildName: guild.name,
            prefix: prefix,
            youtube: { channels: [yt_channel] },
          })
          .catch(console.error);
      } else {
        let changed = false;
        if (!Array.isArray(youtube.channels)) youtube.channels = [];
        if (action === 'add') {
          if (!youtube.channels.includes(yt_channel)) {
            youtube.channels.push(yt_channel);
            changed = true;
          }
        } else if (action === 'remove') {
          const idx = youtube.channels.indexOf(yt_channel);
          if (idx !== -1) {
            youtube.channels.splice(idx, 1);
            changed = true;
          }
        }
        if (changed) await profile.save().catch(console.error);
      }
      return await interaction.reply(
        errorEmbed({
          description: `Đã ${
            action === 'add' ? 'thêm' : 'xoá'
          } kênh **[${title}](https://www.youtube.com/channel/${yt_channel})** trong danh sách theo dõi của server`,
          emoji: true,
        }),
      );
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
