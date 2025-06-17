const { Client, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { toCurrency } = require('../common/ultils');

/** @param {Client} client - Client. */
module.exports = (client) => {
  /**
   * Tranfers
   * @param {ChatInputCommandInteraction} interaction - Interaction object.
   */
  client.robUser = async (target, interaction) => {
    const { user, guild } = interaction;
    const { errorEmbed, catchError, user: bot } = client;
    const [guildID, userID] = [guild.id, user.id];
    const now = new Date();
    const cooldownMs = 30 * 60 * 1000; // 30 phút

    if (target.bot)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể giật \\💲 của bot!', emoji: false }));

    if (target.id === user.id)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể tự giật \\💲 của chính mình!', emoji: false }));

    try {
      // Lấy profile của user và target
      let profile = await economyProfile.findOne({ guildID, userID }).catch(console.error);
      let targetProfile = await economyProfile.findOne({ guildID, userID: target.id }).catch(console.error);

      if (!profile || !targetProfile)
        return await interaction.reply(
          errorEmbed({
            description: !profile ? 'Bạn chưa có tài khoản Economy' : 'Đối tượng giật \\💲 chưa có tài khoản Economy',
            emoji: false,
          }),
        );

      if (profile.balance < 500) {
        return await interaction.reply(errorEmbed({ desc: 'Bạn cần ít nhất 500₫ để thực hiện giật!', emoji: false }));
      }

      if (targetProfile.balance < 100) {
        return await interaction.reply(errorEmbed({ desc: 'Người này không đủ \\💲 để bị giật!', emoji: false }));
      }

      // Cooldown
      if (profile.lastRob && now - profile.lastRob < cooldownMs) {
        const nextRob = new Date(profile.lastRob.getTime() + cooldownMs);
        const timeleft = Math.floor(nextRob.getTime() / 1000);
        return await interaction.reply(
          errorEmbed({ desc: `Bạn vừa giật \\💲 gần đây! Hãy quay lại sau: <t:${timeleft}:R>`, emoji: false }),
        );
      }

      // Tính tỉ lệ thành công
      let successRate = 0.5; // 50%
      // Nếu target là chủ guild
      const guildOwnerId = guild.ownerId;
      if (target.id === guildOwnerId) successRate = 0.1;
      // Nếu target có role cao hơn
      const member = await guild.members.fetch(userID);
      const targetMember = await guild.members.fetch(target.id);
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
        resultMsg = `\\💸 Đã giật thành công **${toCurrency(amount, interaction.locale)}**`;
      } else {
        amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        amount = Math.min(amount, profile.balance); // Không bị trừ quá số \\💲 mình có
        profile.balance -= amount;
        targetProfile.balance += Math.round(amount / 2);
        resultMsg = `\\❌ Thất bại và bị mất **${toCurrency(
          amount,
          interaction.locale,
        )}**, đối phương nhận được **${toCurrency(Math.round(amount / 2), interaction.locale)}**`;
      }

      profile.lastRob = now;
      await profile.save().catch(console.error);
      await targetProfile.save().catch(console.error);

      const embed = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setDescription(`**${user}** vừa giật \\💲 của **${target}**\n\n` + resultMsg)
        .addFields(
          {
            name: `Số dư của ${user.displayName || user.username}`,
            value: toCurrency(profile.balance, interaction.locale),
            inline: true,
          },
          {
            name: `Số dư của ${target.displayName || target.username}`,
            value: toCurrency(targetProfile.balance, interaction.locale),
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
      return await catchError(interaction, e, `Error while executing ${chalk.green('robUser')} function`);
    }
  };
};
