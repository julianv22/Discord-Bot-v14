const serverProfile = require('../../../config/serverProfile');
const { SlashCommandSubcommandBuilder, Client, Interaction } = require('discord.js');

module.exports = {
  data: new SlashCommandSubcommandBuilder()
    .setName('youtube-channel')
    .setDescription('Thêm hoặc xóa kênh YouTube cần theo dõi'),
  category: 'sub command',
  /** @param {Interaction} interaction @param {Client} client */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { options, guildId } = interaction;
    const youtubeInput = options.getString('channel_id');
    const action = options.getString('action');
    const youtubeChannelId = youtubeInput.trim();
    if (!youtubeChannelId) {
      return interaction.reply(errorEmbed('Bạn phải nhập ID kênh YouTube.'));
    }
    try {
      let profile = await serverProfile.findOne({ guildID: guildId });
      if (!profile) {
        if (action === 'remove') return interaction.reply(errorEmbed(true, 'Server chưa có kênh YouTube nào để xóa.'));
        profile = await serverProfile.create({
          guildID: guildId,
          youtubeChannelIds: [youtubeChannelId],
          lastVideoIds: [undefined],
        });
      } else {
        let changed = false;
        if (!Array.isArray(profile.youtubeChannelIds)) profile.youtubeChannelIds = [];
        if (!Array.isArray(profile.lastVideoIds)) profile.lastVideoIds = [];
        if (action === 'add') {
          if (!profile.youtubeChannelIds.includes(youtubeChannelId)) {
            profile.youtubeChannelIds.push(youtubeChannelId);
            profile.lastVideoIds.push(undefined);
            changed = true;
          }
        } else if (action === 'remove') {
          const idx = profile.youtubeChannelIds.indexOf(youtubeChannelId);
          if (idx !== -1) {
            profile.youtubeChannelIds.splice(idx, 1);
            profile.lastVideoIds.splice(idx, 1);
            changed = true;
          }
        }
        if (changed) await profile.save();
      }
      await interaction.reply(errorEmbed(false, 'Đã cập nhật danh sách kênh YouTube theo dõi cho server.'));
    } catch (e) {
      console.error('Lỗi setup youtube channel:', e);
      await interaction.reply(errorEmbed(true, 'Có lỗi xảy ra khi thiết lập kênh YouTube.', e));
    }
  },
};
