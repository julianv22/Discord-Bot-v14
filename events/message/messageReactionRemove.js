const serverProfile = require('../../config/serverProfile');
module.exports = {
  name: 'messageReactionRemove',
  /**
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  async execute(reaction, user) {
    try {
      if (user.bot) return;
      const { message } = reaction;
      if (!message.guildId) return;

      // Lấy cấu hình server
      const profile = await serverProfile.findOne({ guildID: message.guildId }).catch(() => {});
      if (!profile || !profile.starboardChannel || !profile.starCount || profile.starCount <= 0) return;

      // Chỉ xử lý emoji "⭐"
      if (reaction.emoji.name !== '⭐') return;

      // Đếm lại số lượng reaction "⭐" trên message
      const starReaction = message.reactions.cache.get('⭐');
      const count = starReaction ? starReaction.count : 0;

      // Nếu số lượng ⭐ < starCount, xoá message trên starboard
      if (count < profile.starCount) {
        const guild = message.guild;
        const starboardChannel = guild.channels.cache.get(profile.starboardChannel);
        if (!starboardChannel) return;

        // Xoá message starboard dựa vào messageId đã lưu
        if (profile.starboardMessages && profile.starboardMessages[message.id]) {
          const starMsgId = profile.starboardMessages[message.id];
          const starMsg = await starboardChannel.messages.fetch(starMsgId).catch(() => null);
          if (starMsg) await starMsg.delete().catch(() => {});
          // Xoá mapping khỏi profile
          delete profile.starboardMessages[message.id];
          await profile.save();
        } else {
          // Nếu không lưu, fallback: tìm bằng nội dung như cũ
          const fetched = await starboardChannel.messages.fetch({ limit: 100 });
          const starMsg = fetched.find((m) => m.embeds.length > 0 && m.embeds[0].description === message.content);
          if (starMsg) await starMsg.delete().catch(() => {});
        }
      }
    } catch (e) {
      console.error('Error in messageReactionRemove:', e);
    }
  },
};
