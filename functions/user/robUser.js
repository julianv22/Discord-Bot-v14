const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

/** @param {Client} client - Discord Client. */
module.exports = (client) => {
  /** - Tranfers
   * @param {GuildMember} target - Target user
   * @param {Interaction} interaction - Command Interaction. */
  client.robUser = async (target, interaction) => {
    const { user, guild, guildId } = interaction;
    const { errorEmbed, catchError, user: bot } = client;
    const now = new Date();
    const cooldownMs = 30 * 60 * 1000; // 30 phút

    if (target.bot) return await interaction.reply(errorEmbed({ desc: 'Bạn không thể giật \\💲 của bot!' }));

    if (target.id === user.id)
      return await interaction.reply(errorEmbed({ desc: 'Bạn không thể tự giật \\💲 của chính mình!' }));

    try {
      // Lấy profile của user và target
      const [profile, targetProfile] = await Promise.all([
        await economyProfile.findOne({ guildId, userId: user.id }).catch(console.error),
        await economyProfile.findOne({ guildId, userId: target.id }).catch(console.error),
      ]);

      if (!profile || !targetProfile)
        return await interaction.reply(
          errorEmbed({
            desc: !profile ? 'Bạn chưa có tài khoản Economy' : 'Đối tượng giật \\💲 chưa có tài khoản Economy',
          })
        );

      if (profile?.balance < 500)
        return await interaction.reply(errorEmbed({ desc: 'Bạn cần ít nhất 500₫ để thực hiện giật!' }));

      if (targetProfile?.balance < 100)
        return await interaction.reply(errorEmbed({ desc: 'Người này không đủ \\💲 để bị giật!' }));

      // Cooldown
      if (profile?.lastRob && now - profile?.lastRob < cooldownMs) {
        const nextRob = new Date(profile?.lastRob.getTime() + cooldownMs);
        const timeleft = Math.floor(nextRob.getTime() / 1000);

        return await interaction.reply(
          errorEmbed({ desc: `Bạn vừa giật \\💲 gần đây! Hãy quay lại sau: <t:${timeleft}:R>` })
        );
      }

      // Tính tỉ lệ thành công
      let successRate = 0.5; // 50%
      // Nếu target là chủ guild
      const guildOwnerId = guild.ownerId;
      if (target.id === guildOwnerId) successRate = 0.1;
      // Nếu target có role cao hơn
      const member = await guild.members.fetch(user.id);
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
        resultMsg = `\\💸 Đã giật thành công **${amount.toCurrency()}**`;
      } else {
        amount = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        amount = Math.min(amount, profile.balance); // Không bị trừ quá số \\💲 mình có
        profile.balance -= amount;
        targetProfile.balance += Math.round(amount / 2);
        resultMsg = `\\❌ Thất bại và bị mất **${amount.toCurrency()}**, đối phương nhận được **${Math.round(
          amount / 2
        ).toCurrency()}**`;
      }

      profile.lastRob = now;
      await profile.save().catch(console.error);
      await targetProfile.save().catch(console.error);

      const embeds = [
        new EmbedBuilder()
          .setColor(isSuccess ? Colors.DarkGreen : Colors.DarkGold)
          .setThumbnail(cfg.economyPNG)
          .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
          .setDescription(`**${user}** vừa giật \\💲 của **${target}**\n\n` + resultMsg)
          .setFooter({
            text: `${isSuccess ? 'Tuyệt vời! 🤗' : 'Chúc may mắn lần sau! 😞'}`,
            iconURL: bot.displayAvatarURL(),
          })
          .setTimestamp()
          .setFields(
            {
              name: `Số dư của ${user.displayName || user.username}`,
              value: profile?.balance.toCurrency(),
              inline: true,
            },
            {
              name: `Số dư của ${target.displayName || target.username}`,
              value: targetProfile?.balance.toCurrency(),
              inline: true,
            }
          ),
      ];

      return await interaction.reply({ embeds });
    } catch (e) {
      return await catchError(interaction, e, `Error while executing ${chalk.green('robUser')} function`);
    }
  };
};
