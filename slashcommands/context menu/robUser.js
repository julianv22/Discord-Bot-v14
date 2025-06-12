const {
  ContextMenuCommandBuilder,
  Client,
  CommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  category: 'context menu',
  scooldown: 0,
  data: new ContextMenuCommandBuilder().setName('Rob User').setType(ApplicationCommandType.User),
  /**
   * Rob money from a user
   * @param {CommandInteraction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { guild, targetUser, user } = interaction;
    const { errorEmbed, catchError, user: bot } = client;
    const cooldownMs = 30 * 60 * 1000; // 30 phút

    try {
      if (targetUser.bot)
        return await interaction.reply(errorEmbed({ description: 'Không thể giật \\💲 của bot!', emoji: false }));
      if (targetUser.id === user.id)
        return await interaction.reply(
          errorEmbed({ description: 'Không thể giật \\💲 của chính bản thân mình!', emoji: false }),
        );

      let [profile, targetProfile] = await Promise.all([
        await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error),
        await economyProfile.findOne({ guildID: guild.id, userID: targetUser.id }).catch(console.error),
      ]);

      if (!profile || !targetProfile)
        return await interaction.reply(
          errorEmbed({
            description: !profile ? 'Bạn chưa có tài khoản Economy' : 'Đối tượng giật \\💲 chưa có tài khoản Economy',
            emoji: false,
          }),
        );
      if (profile.balance < 200)
        return await interaction.reply(
          errorEmbed({ description: 'Bạn cần ít nhất 200\\💲 để thực hiện giật!', emoji: false }),
        );
      if (targetProfile.balance < 100) {
        return await interaction.reply(
          errorEmbed({ description: 'Người này không đủ \\💲 để bị giật!', emoji: false }),
        );
      }
      // Cooldown
      if (profile.lastRob && new Date() - profile.lastRob < cooldownMs) {
        const nextRob = new Date(profile.lastRob.getTime() + cooldownMs);
        const timeleft = Math.floor(nextRob.getTime() / 1000);
        return await interaction.reply(
          errorEmbed({ description: `Bạn vừa giật \\💲 gần đây! Hãy quay lại sau: <t:${timeleft}:R>`, emoji: false }),
        );
      }

      // Tính tỉ lệ thành công
      let successRate = 0.5; // 50%
      // Nếu target là chủ guild
      const guildOwnerId = guild.ownerId;
      if (targetUser.id === guildOwnerId) successRate = 0.1;
      // Nếu target có role cao hơn
      const member = await guild.members.fetch(user.id);
      const targetMember = await guild.members.fetch(targetUser.id);
      if (targetMember.roles.highest.comparePositionTo(member.roles.highest) > 0) successRate = 0.4;

      // Xác định thành công/thất bại
      const isSuccess = Math.random() < successRate;
      let amount = 0;
      let resultMsg = '';
      if (isSuccess) {
        amount = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
        amount = Math.min(amount, targetProfile.balance); // Không giật quá số coin họ có
        profile.balance += amount;
        targetProfile.balance -= amount;
        resultMsg = `\\💸 Đã giật thành công **${amount.toLocaleString()}**\\💲!`;
      } else {
        amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        amount = Math.min(amount, profile.balance); // Không bị trừ quá số \\💲 mình có
        profile.balance -= amount;
        targetProfile.balance += Math.round(amount / 2);
        resultMsg = `\\❌ Thất bại và bị mất **${amount.toLocaleString()}**\\💲, đối phương nhận được **${Math.round(
          amount / 2,
        ).toLocaleString()}**\\💲!`;
      }
      profile.lastRob = new Date();
      await profile.save().catch(console.error);
      await targetProfile.save().catch(console.error);

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setDescription(`**${user}** vừa giật \\💲 của **${targetUser}**\n\n` + resultMsg)
        .addFields(
          {
            name: `Số dư của ${user.displayName || user.username}`,
            value: `${profile.balance.toLocaleString()}\\💲`,
            inline: true,
          },
          {
            name: `Số dư của ${targetUser.displayName || targetUser.username}`,
            value: `${targetProfile.balance.toLocaleString()}\\💲`,
            inline: true,
          },
        )
        .setColor(isSuccess ? 'Green' : 'Red')
        .setThumbnail(cfg.economyPNG)
        .setFooter({
          text: `${isSuccess ? 'Tuyệt vời! 🤗' : 'Chúc may mắn lần sau! 😞'}`,
          iconURL: bot.displayAvatarURL(),
        })
        .setTimestamp();

      return await interaction.reply({ embeds: [embed] });
    } catch (e) {
      catchError(interaction, e, this);
    }
  },
};
