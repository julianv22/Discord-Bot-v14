const { Message, EmbedBuilder } = require('discord.js');
const serverProfile = require('../../config/serverProfile');
const { linkButton } = require('./components');
const { logError } = require('./logging');

module.exports = {
  /** - Update message or send a message to Starboard Channel when user reacting ⭐ emoji
   * @param {Message} message - Message object
   * @param {string} userId - Id of user reacted ⭐ emoji
   * @param {number} count - Count ⭐ emojis of message */
  starReactionAdd: async (message, userId, count) => {
    const { guild, guildId, id: messageId, author } = message;

    if (message.author.id === userId) return;
    if (message.attachments && message.attachments.size > 0) return;

    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    const { starboard } = profile || {};

    if (!profile || !starboard?.channelId || !starboard?.starCount || starboard?.starCount === 0) return;

    if (count < starboard?.starCount) return;

    const starboardChannel = guild.channels.cache.get(starboard?.channelId);
    if (!starboardChannel) return;

    try {
      // Lấy content hoặc embeds của message đã react ⭐ emoji
      let embeds = [];
      if (message.embeds && message.embeds.length > 0) embeds = message.embeds.map((embed) => EmbedBuilder.from(embed));

      if (embeds.length === 0 && message.content)
        embeds = [
          new EmbedBuilder()
            .setColor(Math.floor(Math.random() * 0xffffff))
            .setAuthor({ name: author.displayName || author.username, iconURL: author.displayAvatarURL(true) })
            .setDescription(message.content)
            .setFooter({ text: guild.name, iconURL: guild.iconURL(true) })
            .setTimestamp(),
        ];

      if (embeds.length > 0) {
        if (!starboard?.messages) starboard.messages = {};

        const starboardMessage = starboard?.messages?.[messageId];

        /** Cập nhật lại nội dung message trong Starboard Channel và database */
        const sendNewMessage = async () => {
          const sendNew = await starboardChannel.send({
            content: `**${count}** \\⭐ in <#${message.channel.id}>:`,
            embeds,
            components: [linkButton(message.url)],
          });

          starboard.messages[messageId] = { id: sendNew.id, lastTime: Date.now() };
          profile.markModified('starboard.messages');
          await profile.save().catch(console.error);
        };

        if (starboardMessage && starboardMessage?.id) {
          // Nếu đã tồn tại messages trong Starboard Channel, update số ⭐ và nội dung embed
          const sentMessage = await starboardChannel.messages.fetch(starboardMessage.id).catch(console.error);

          if (sentMessage) {
            await sentMessage.edit({ content: `**${count}** \\⭐ in <#${message.channel.id}>:`, embeds });
            starboard.messages[messageId].lastTime = Date.now();
            profile.markModified('starboard.messages');
            await profile.save().catch(console.error);
          } else await sendNewMessage(); // Nếu không fetch được message trong Starboard Channel, gửi message mới và lưu vào database
        } else await sendNewMessage(); // Nếu chưa tồn tại thì gửi message mới
      }
    } catch (e) {
      return logError({ item: 'Starboard reactionAdd', desc: 'event' }, e);
    }
  },
  /** - Update or delete message from Starboard Channel when user removing ⭐ emoji reaction
   * @param {Message} message - Message object
   * @param {number} count - Emojis count of message */
  starReactionRemove: async (message, count) => {
    const { guild, guildId, id: messageId } = message;
    const profile = await serverProfile.findOne({ guildId }).catch(console.error);
    const { starboard } = profile || {};

    if (!profile || !starboard?.channelId || !starboard?.starCount || starboard?.starCount === 0) return;

    const starboardChannel = guild.channels.cache.get(starboard?.channelId);
    if (!starboardChannel) return;

    try {
      const starReaction = (await message.fetch()).reactions.cache.get('⭐');
      count = starReaction ? starReaction.count : 0;
      const starboardMessage = starboard?.messages?.[messageId];
      const sentMessage = await starboardChannel.messages.fetch(starboardMessage?.id); // Fectch message đã gửi trong Starboard Channel

      if (sentMessage && sentMessage.deletable) {
        if (count < starboard?.starCount) {
          // Nếu số ⭐ nhỏ hơn starCount thì xoá message trong Starboard Channel và cập nhật database
          await sentMessage.delete().catch(console.error);
          delete starboard.messages[messageId];
          profile.markModified('starboard.messages');
          await profile.save().catch(console.error);
        } else {
          // Nếu số ⭐ vẫn thoả mãn điều kiện starCount thì update nội dung message
          await sentMessage.edit({ content: `**${count}** \\⭐ in <#${message.channel.id}>:` });
          starboard.messages[messageId].lastTime = Date.now();
          profile.markModified('starboard.messages');
          await profile.save().catch(console.error);
        }
      }
    } catch (e) {
      return logError({ item: 'Starboard reactionRemove', desc: 'event' }, e);
    }
  },
};
