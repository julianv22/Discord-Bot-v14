const { MessageReaction, User } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  name: 'messageReactionRemove',
  /** - MessageReaction Starboard Remove Event
   * @param {MessageReaction} reaction
   * @param {User} user */
  async execute(reaction, user) {
    try {
      const { message } = reaction;
      if (user.bot) return;
      if (!message.guildId) return;

      // Lấy cấu hình server
      const profile = await serverProfile.findOne({ guildID: message.guildId }).catch(console.error);
      const { starboard } = profile.setup;
      if (!profile || !starboard.channel || !starboard.star || starboard.star <= 0) return;
      // Chỉ xử lý emoji "⭐"
      if (reaction.emoji.name === '⭐') {
        // Đếm lại số lượng reaction "⭐" trên message
        const fetchedMsg = await message.fetch();
        const starReaction = fetchedMsg.reactions.cache.get('⭐');
        const count = starReaction ? starReaction.count : 0;

        // Nếu số lượng ⭐ < starCount, xoá message trên starboard
        if (count < starboard.star) {
          const guild = message.guild;
          const starboardChannel = guild.channels.cache.get(starboard.channel);

          if (!starboardChannel) return;

          // Xoá message starboard dựa vào messageId đã lưu (dạng object: { id, lastTime })
          if (starboard.messages && starboard.messages[message.id] && starboard.messages[message.id].id) {
            const starMsgId = starboard.messages[message.id].id;
            const starMsg = await starboardChannel.messages.fetch(starMsgId).catch(console.error);

            if (starMsg) await starMsg.delete().catch(console.error);
            // Xoá mapping khỏi profile
            delete starboard.messages[message.id];
            await profile.save().catch(console.error);
          } else {
            // Nếu không lưu, fallback: tìm bằng nội dung như cũ
            const fetched = await starboardChannel.messages.fetch({ limit: 100 });
            const starMsg = fetched.find((m) => m.embeds.length > 0 && m.embeds[0]?.description === message.content);
            if (starMsg) await starMsg.delete().catch(console.error);
          }
        }
      }
    } catch (e) {
      console.error(chalk.red(`Error while executing Starboard Remove event\n`), e);
    }
  },
};
