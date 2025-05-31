const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const serverProfile = require('../../../config/serverProfile');
/**
 * Validate Youtube channel
 * @param {string} channelId - ID of the Youtube channel
 * @param {string} apiKey - API key for Youtube
 * @returns {Promise<{ valid: boolean, title: string | null }>}
 */
async function validateYoutubeChannel(channelId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.items && data.items.length > 0) {
    return { valid: true, title: data.items[0].snippet.title };
  }
  return { valid: false, title: null };
}
module.exports = {
  category: 'sub command',
  parent: 'youtube',
  scooldown: 0,
  data: new SlashCommandSubcommandBuilder().setName('setup'),
  /**
   * Setup Youtube channel
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guild } = interaction;
    const yt_channel = options.getString('channel-id');
    const action = options.getString('action');

    try {
      // Xác thực channel ID và lấy tên kênh
      const { valid, title } = await validateYoutubeChannel(yt_channel, process.env.YT_API_KEY);
      if (!valid) {
        return await interaction.reply(
          errorEmbed({ description: 'ID kênh Youtube không hợp lệ hoặc không tồn tại!', emoji: false }),
        );
      }

      let profile = await serverProfile.findOne({ guildID: guild.id }).catch(() => {});
      const { youtube } = profile;
      if (!profile) {
        if (action === 'remove')
          return await interaction.reply(errorEmbed({ description: 'Server chưa có kênh Youtube nào!', emoji: false }));
        await profile
          .create({
            guildID: guild.id,
            guildName: guild.name,
            prefix: cfg.prefix,
            youtube: { channels: [yt_channel] },
          })
          .catch(() => {});
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
        if (changed) await profile.save().catch(() => {});
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
      console.error(chalk.red('Error while executing /setup youtube command', e));
      return await interaction.reply(
        errorEmbed({ title: `\\❌ Error while setting up Youtube channel`, description: e, color: 'Red' }),
      );
    }
  },
};
