const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { toCurrency } = require('../../functions/common/utilities');

module.exports = {
  type: 'buttons',
  data: { name: 'transfer-btn' },
  /** - Transfer Money Button
   * @param {ChatInputCommandInteraction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, customId, locale } = interaction;
    const { errorEmbed, catchError } = client;
    // Tách customId lấy amount, fee, targetId
    const [, amountStr, feeStr, targetId] = customId.split(':');

    if (amountStr === 'cancel') return interaction.update({ content: '\\❌ Huỷ giao dịch!', components: [] });

    const amount = parseInt(amountStr, 10);
    const fee = parseInt(feeStr, 10);
    const total = amount + fee;

    try {
      // Lấy profile của người chuyển và người nhận
      let [profile, targetProfile] = await Promise.all([
        await economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error),
        await economyProfile.findOne({ guildID: guild.id, userID: targetId }).catch(console.error),
      ]);

      // Kiểm tra lại dữ liệu
      if (!profile)
        return await interaction.update(errorEmbed({ desc: 'Không kết nối được với database', emoji: false }));
      if (!targetProfile)
        targetProfile = await economyProfile
          .create({ guildID: guild.id, guildName: guild.name, userID: targetId, bank: 0 })
          .catch(console.error);
      if (amount > profile.bank)
        return await interaction.update(errorEmbed({ desc: 'Bạn không có đủ \\💲 để chuyển', emoji: false }));

      // Trừ tiền người chuyển, cộng tiền người nhận
      profile.bank -= total;
      targetProfile.bank += amount;

      await profile.save().catch(console.error);
      await targetProfile.save().catch(console.error);
      // Tạo embed thông báo cho người chuyển
      const embedSender = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('\\✅ Chuyển tiền thành công!')
        .setDescription(
          `\\♻️ Bạn đã chuyển **${toCurrency(
            amount,
            locale
          )}** cho <@${targetId}>.\n\n\\💵 Phí giao dịch: **${toCurrency(
            fee,
            locale
          )}**\n\n\\💸 Tổng trừ: **${toCurrency(total, locale)}**\n\n\\🏦 Số dư còn lại: **${toCurrency(
            profile.bank,
            locale
          )}**`
        )
        .setColor(Colors.Green)
        .setThumbnail(cfg.economyPNG)
        .setTimestamp()
        .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

      // Tạo embed thông báo cho người nhận
      const embedReceiver = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
        .setTitle('Bạn vừa nhận được tiền!')
        .setDescription(
          `Bạn vừa nhận được **${toCurrency(amount, locale)}** từ <@${user.id}> trong guild ${
            guild.name
          }.\n\n\\🏦 Số dư mới: **${toCurrency(targetProfile.bank, locale)}**`
        )
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.economyPNG)
        .setTimestamp()
        .setFooter({
          text: client.user.displayName || client.user.username,
          iconURL: client.user.displayAvatarURL(true),
        });

      // Gửi thông báo cho người nhận (nếu có thể)
      const member = await guild.members.fetch(targetId);
      await member.send({ embeds: [embedReceiver] }).catch(console.error);

      // Cập nhật lại interaction cho người chuyển
      return await interaction.update({ embeds: [embedSender], components: [] });
    } catch (e) {
      return await catchError(interaction, e, this);
    }
  },
};
