const { Client, ButtonInteraction, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  type: 'buttons',
  data: { name: 'transfer' },
  /** - Transfer Money Button
   * @param {ButtonInteraction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    const { user, guild, customId } = interaction;
    const { errorEmbed } = client;
    // Tách customId lấy amount, fee, targetId
    const [, amountStr, feeStr, targetId] = customId.split(':');

    if (amountStr === 'cancel') return interaction.update({ content: '\\❌ Huỷ giao dịch!', components: [] });

    const amount = parseInt(amountStr, 10);
    const fee = parseInt(feeStr, 10);
    const total = amount + fee;

    // Lấy profile của người chuyển và người nhận
    let [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error),
      economyProfile.findOne({ guildID: guild.id, userID: targetId }).catch(console.error),
    ]);

    // Kiểm tra lại dữ liệu
    if (!profile)
      return await interaction.update(errorEmbed({ desc: 'Không tìm thấy tài khoản của bạn trong cơ sở dữ liệu!' }));

    if (!targetProfile)
      targetProfile = await economyProfile
        .create({ guildID: guild.id, guildName: guild.name, userID: targetId, bank: 0 })
        .catch(console.error);

    if (profile.bank < total)
      return await interaction.update(
        errorEmbed({ desc: `Bạn không có đủ \\💲 để chuyển! Số dư ngân hàng của bạn: ${profile.bank.toCurrency()}` })
      );

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
        `\\♻️ Bạn đã chuyển **${amount.toCurrency()}** cho <@${targetId}>.\n\n\\💵 Phí giao dịch: **${fee.toCurrency()}**\n\n\\💸 Tổng trừ: **${total.toCurrency()}**\n\n\\🏦 Số dư còn lại: **${profile.bank.toCurrency()}**`
      )
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.economyPNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    // Tạo embed thông báo cho người nhận
    const embedReceiver = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Bạn vừa nhận được tiền!')
      .setDescription(
        `Bạn vừa nhận được **${amount.toCurrency()}** từ <@${user.id}> trong guild ${
          guild.name
        }.\n\n\\🏦 Số dư mới: **${targetProfile.bank.toCurrency()}**`
      )
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.economyPNG)
      .setTimestamp()
      .setFooter({
        text: client.user.displayName || client.user.username,
        iconURL: client.user.displayAvatarURL(true),
      });

    // Gửi thông báo cho người nhận (nếu có thể)
    try {
      const member = await guild.members.fetch(targetId);
      await member.send({ embeds: [embedReceiver] });
    } catch (e) {
      client.catchError(interaction, e, 'Lỗi khi gửi tin nhắn cho người nhận');
    }

    // Cập nhật lại interaction cho người chuyển
    return await interaction.update({ embeds: [embedSender], components: [] });
  },
};
