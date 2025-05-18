const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageReactionAdd',
  /** @param {MessageReaction} reaction @param {User} user */
  async execute(reaction, user) {
    try {
      // Bỏ qua nếu là bot
      if (user.bot) return;

      const { message } = reaction;
      if (!message.guildId) return;

      // Lấy cấu hình server
      const profile = await serverProfile.findOne({ guildID: message.guildId });
      if (!profile || !profile.starboardChannel || !profile.starCount || profile.starCount <= 0) return;

      // Chỉ xử lý emoji "⭐"
      if (reaction.emoji.name !== '⭐') return;

      // Đếm số lượng reaction "⭐" trên message
      const starReaction = message.reactions.cache.get('⭐');
      const count = starReaction ? starReaction.count : 0;

      // Đủ số lượng starCount mới gửi
      if (count < profile.starCount) return;

      // Không cho tự star chính mình
      if (message.author.id === user.id) return;

      // Lấy channel starboard
      const guild = message.guild;
      const starboardChannel = guild.channels.cache.get(profile.starboardChannel);
      if (!starboardChannel) return;

      // Nếu có attachment thì bỏ qua
      if (message.attachments && message.attachments.size > 0) return;

      // Nếu là embed thì gửi lại embed tương tự
      if (message.embeds && message.embeds.length > 0) {
        for (const embed of message.embeds) {
          const rebuilt = EmbedBuilder.from(embed)
            .addFields({
              name: 'Source',
              value: `[Jump link](${message.url})`,
              inline: false,
            })
            .setFooter({
              text: message.guild.name,
              iconURL: message.guild.iconURL(true),
            });
          await starboardChannel.send({
            content: `**${count}** \\⭐ in <#${message.channel.id}>`,
            embeds: [rebuilt],
          });
        }
      } else {
        // Nếu là message thường
        await starboardChannel.send({
          content: `**${count}** \\⭐ in <#${message.channel.id}>`,
          embeds: [
            new EmbedBuilder()
              .setColor('Random')
              .setAuthor({
                name: message.member?.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL(true),
              })
              .setDescription(message.content || 'No content')
              .addFields({
                name: 'Source',
                value: `[Jump link](${message.url})`,
                inline: false,
              })
              .setFooter({
                text: message.guild.name,
                iconURL: message.guild.iconURL(true),
              })
              .setTimestamp(),
          ],
        });
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Error in messageReactionAdd:'), e);
    }
  },
};
