const serverProfile = require('../../config/serverProfile');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

      // Jump link button
      const jumpButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Go to message').setStyle(ButtonStyle.Link).setURL(message.url),
      );

      // Chuẩn bị embeds nếu có
      let embeds = [];
      if (message.embeds && message.embeds.length > 0) {
        embeds = message.embeds.map((embed) =>
          EmbedBuilder.from(embed).setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL(true),
          }),
        );
      }

      // Nếu là message thường (chỉ có content)
      if (embeds.length === 0 && message.content) {
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
      }

      // Nếu có content hoặc embed
      if (embeds.length > 0) {
        await starboardChannel.send({
          content: `**${count}** \\⭐ in <#${message.channel.id}>`,
          embeds: embeds,
          components: [jumpButton],
        });
      }
    } catch (e) {
      console.error(chalk.yellow.bold('Error in messageReactionAdd:'), e);
    }
  },
};
