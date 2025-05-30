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
      if (
        !profile ||
        !profile.setup.starboard.channel ||
        !profile.setup.starboard.star ||
        profile.setup.starboard.star <= 0
      )
        return;

      // Chỉ xử lý emoji "⭐"
      if (reaction.emoji.name !== '⭐') return;

      // Đếm lại số lượng reaction "⭐" trên message
      const fetchedMsg = await message.fetch();
      const starReaction = fetchedMsg.reactions.cache.get('⭐');
      const count = starReaction ? starReaction.count : 0;

      // Nếu số lượng ⭐ < starCount, xoá message trên starboard
      if (count < profile.setup.starboard.star) {
        const guild = message.guild;
        const starboardChannel = guild.channels.cache.get(profile.setup.starboard.channel);
        if (!starboardChannel) return;

        // Xoá message starboard dựa vào messageId đã lưu (dạng object: { id, lastTime })
        if (
          profile.setup.starboard.messages &&
          profile.setup.starboard.messages[message.id] &&
          profile.setup.starboard.messages[message.id].id
        ) {
          const starMsgId = profile.setup.starboard.messages[message.id].id;
          const starMsg = await starboardChannel.messages.fetch(starMsgId).catch(() => null);
          if (starMsg) await starMsg.delete().catch(() => {});
          // Xoá mapping khỏi profile
          delete profile.setup.starboard.messages[message.id];
          await profile.save().catch(() => {});
        } else {
          // Nếu không lưu, fallback: tìm bằng nội dung như cũ
          const fetched = await starboardChannel.messages.fetch({ limit: 100 });
          const starMsg = fetched.find((m) => m.embeds.length > 0 && m.embeds[0]?.description === message.content);
          if (starMsg) await starMsg.delete().catch(() => {});
        }
      }
    } catch (e) {
      console.error(chalk.red('Error while executing messageReactionRemove event'), e);
    }
  },
};
