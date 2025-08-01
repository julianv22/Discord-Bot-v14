const { Client, Interaction, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../config/economyProfile');
const { embedMessage } = require('../../functions/common/logging');

module.exports = {
  type: 'buttons',
  data: { name: 'transfer' },
  /** - Transfer Money Button
   * @param {Interaction} interaction - Button Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferUpdate();

    const { guild, guildId, user, customId } = interaction;
    // Tách customId lấy amount, fee, targetId
    const [, amountStr, feeStr, targetId] = customId.split(':');

    if (amountStr === 'cancel')
      return interaction.editReply({ ...embedMessage({ desc: 'Huỷ giao dịch' }), components: [] });

    const amount = parseInt(amountStr, 10);
    const fee = parseInt(feeStr, 10);
    const total = amount + fee;

    // Lấy profile của người chuyển và người nhận
    const [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildId, userId: user.id }).catch(console.error),
      economyProfile.findOne({ guildId, userId: targetId }).catch(console.error),
    ]);

    // Kiểm tra lại dữ liệu
    if (!profile || !targetProfile)
      return await interaction.editReply({
        ...embedMessage({
          desc: !profile
            ? 'Không tìm thấy tài khoản của bạn trong cơ sở dữ liệu!'
            : 'Không tìm thấy tài khoản của người nhận trong cơ sở dữ liệu!',
        }),
        components: [],
      });

    if (profile?.bank < total)
      return await interaction.editReply({
        ...embedMessage({
          desc: `Bạn không có đủ 💲 để chuyển! Số dư ngân hàng của bạn: ${profile?.bank.toCurrency()}`,
        }),
        components: [],
      });

    // Trừ tiền người chuyển, cộng tiền người nhận
    profile.bank -= total;
    targetProfile.bank += amount;

    await profile.save().catch(console.error);
    await targetProfile.save().catch(console.error);

    // Tạo embed thông báo cho người chuyển
    const embedSender = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.coin_gif)
      .setAuthor({ name: 'Economy Transfer', iconURL: cfg.money_wings_gif })
      .setDescription(
        `${user} đã chuyển **${amount.toCurrency()}** cho <@${targetId}>.\n- \\💵 Phí giao dịch: **${fee.toCurrency()}**\n- \\💸 Tổng trừ: **${total.toCurrency()}**\n- \\🏦 Số dư còn lại: **${profile?.bank.toCurrency()}**`
      )
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) })
      .setTimestamp();

    // Tạo embed thông báo cho người nhận
    const embedReceiver = new EmbedBuilder()
      .setColor(Colors.DarkGreen)
      .setThumbnail(cfg.coin_gif)
      .setAuthor({ name: guild.name, iconURL: cfg.money_wings_gif })
      .setTitle('Bạn vừa nhận được tiền!')
      .setDescription(
        `Bạn vừa nhận được **${amount.toCurrency()}** từ <@${user.id}> trong guild ${
          guild.name
        }.\n\n\\🏦 Số dư mới: **${targetProfile?.bank.toCurrency()}**`
      )
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
      return await client.catchError(interaction, e, 'Lỗi khi gửi tin nhắn cho người nhận');
    }

    // Cập nhật lại interaction cho người chuyển
    await interaction.editReply({ ...embedMessage({ desc: 'Chuyển tiền thành công!', emoji: true }), components: [] });
    await interaction.channel.send({ embeds: [embedSender] });
  },
};
