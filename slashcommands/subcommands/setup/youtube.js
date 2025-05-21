const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');
const fetch = require('node-fetch');

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
  data: new SlashCommandSubcommandBuilder().setName('youtube'),
  category: 'sub command',
  parent: 'setup',
  scooldown: 0,

  /** @param {Interaction} interaction @param {Client} client */ async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const yt_channel = options.getString('channel-id');
    const action = options.getString('action');

    try {
      // Xác thực channel ID và lấy tên kênh
      const { valid, title } = await validateYoutubeChannel(yt_channel, process.env.YT_API_KEY);
      if (!valid) {
        return interaction.reply(errorEmbed(true, 'ID kênh Youtube không hợp lệ hoặc không tồn tại!'));
      }

      let profile = await serverProfile.findOne({ guildID: guildId }).catch(() => {});
      if (!profile) {
        if (action === 'remove') return interaction.reply(errorEmbed(true, 'Server chưa có kênh Youtube nào!'));
        profile = await serverProfile.create({
          guildID: guildId,
          youtubeChannelIds: [yt_channel],
        });
      } else {
        let changed = false;
        if (!Array.isArray(profile.youtubeChannelIds)) profile.youtubeChannelIds = [];
        // if (!Array.isArray(profile.lastVideoIds)) profile.lastVideoIds = [];
        if (action === 'add') {
          if (!profile.youtubeChannelIds.includes(yt_channel)) {
            profile.youtubeChannelIds.push(yt_channel);
            changed = true;
          }
        } else if (action === 'remove') {
          const idx = profile.youtubeChannelIds.indexOf(yt_channel);
          if (idx !== -1) {
            profile.youtubeChannelIds.splice(idx, 1);
            changed = true;
          }
        }
        if (changed) await profile.save().catch(() => {});
      }
      await interaction.reply(
        errorEmbed(
          false,
          `Đã ${
            action === 'add' ? 'thêm' : 'xoá'
          } kênh **[${title}](https://www.youtube.com/channel/${yt_channel})** trong danh sách theo dõi của server`,
        ),
      );
    } catch (e) {
      console.error(chalk.yellow.bold('Error ():', e));
      return interaction.reply(errorEmbed(true, 'Lỗi setup Youtube channel:', e));
    }
  },
};
