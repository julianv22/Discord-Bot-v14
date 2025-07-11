const { MessageReaction, User, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const serverProfile = require('../../config/serverProfile');

module.exports = {
  name: 'messageReactionAdd',
  /** - Message Reaction Starboard Add Event
   * @param {MessageReaction} reaction - Message Reaction object
   * @param {User} user - User object */
  async execute(reaction, user) {
    try {
      // Bỏ qua nếu là bot
      if (user.bot) return;

      const { message } = reaction;
      if (!message.guildId) return;

      // Lấy cấu hình server
      const profile = await serverProfile.findOne({ guildID: message.guildId }).catch(console.error);
      if (!profile || !starboard.channel || !starboard.star || starboard.star <= 0) return;

      const { starboard } = profile.setup;

      // Chỉ xử lý emoji "⭐"
      if (reaction.emoji.name === '⭐') {
        // Đếm số lượng reaction "⭐" trên message
        const starReaction = message.reactions.cache.get('⭐');
        const count = starReaction ? starReaction.count : 0;

        // Đủ số lượng starCount mới gửi
        if (count < starboard.star) return;

        // Không cho tự star chính mình
        if (message.author.id === user.id) return;

        // Lấy channel starboard
        const guild = message.guild;
        const starboardChannel = guild.channels.cache.get(starboard.channel);

        if (!starboardChannel) return;

        // Nếu có attachment thì bỏ qua
        if (message.attachments && message.attachments.size > 0) return;

        // Jump link button
        const jumpButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('🔗Go to message').setStyle(ButtonStyle.Link).setURL(message.url)
        );

        // Chuẩn bị embeds nếu có
        let embeds = [];
        if (message.embeds && message.embeds.length > 0)
          embeds = message.embeds.map((embed) =>
            EmbedBuilder.from(embed).setFooter({
              text: message.guild.name,
              iconURL: message.guild.iconURL(true),
            })
          );

        // Nếu là message thường (chỉ có content)
        if (embeds.length === 0 && message.content)
          embeds = [
            new EmbedBuilder()
              .setColor('Random')
              .setAuthor({
                name: message.member?.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL(true),
              })
              .setDescription(message.content)
              .setFooter({
                text: message.guild.name,
                iconURL: message.guild.iconURL(true),
              })
              .setTimestamp(),
          ];

        // Nếu có content hoặc embed
        if (embeds.length > 0) {
          if (!starboard.messages) starboard.messages = {};

          const starboardData = starboard.messages[message.id];
          const now = Date.now();

          if (starboardData && starboardData.id) {
            // Đã có message trên starboard, luôn update số star và embed ngay lập tức
            const sentMsg = await starboardChannel.messages.fetch(starboardData.id).catch(console.error);

            if (sentMsg) {
              await sentMsg.edit({
                content: `**${count}** \\⭐ in <#${message.channel.id}>:`,
                embeds,
                components: [jumpButton],
              });
              // Cập nhật lại thời gian cuối cùng update (không cần thiết cho cooldown, nhưng có thể lưu để log)
              starboard.messages[message.id].lastTime = now;
              await profile.save().catch(console.error);
            } else {
              // Nếu không fetch được (bị xoá), cho phép gửi mới nếu qua cooldown
              if (!starboardData.lastTime || now - starboardData.lastTime >= 300000) {
                const newMsg = await starboardChannel.send({
                  content: `**${count}** \\⭐ in <#${message.channel.id}>:`,
                  embeds,
                  components: [jumpButton],
                });

                starboard.messages[message.id] = { id: newMsg.id, lastTime: now };
                await profile.save().catch(console.error);
              }
            }
          } else {
            // Chưa có, chỉ gửi mới nếu đủ cooldown
            if (!starboardData || !starboardData.lastTime || now - starboardData.lastTime >= 300000) {
              const newMsg = await starboardChannel.send({
                content: `**${count}** \\⭐ in <#${message.channel.id}>:`,
                embeds,
                components: [jumpButton],
              });

              starboard.messages[message.id] = { id: newMsg.id, lastTime: now };
              await profile.save().catch(console.error);
            }
          }
        }
      }
    } catch (e) {
      console.error(chalk.red('Error while executing Add Starboard event\n'), e);
    }
  },
};
