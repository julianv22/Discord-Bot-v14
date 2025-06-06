const { Client, Interaction, EmbedBuilder } = require('discord.js');
const economyProfile = require('../../config/economyProfile');

module.exports = {
  data: { name: 'transfer-btn' },
  /**
   * Transfer Money Button
   * @param {Interaction} interaction - Interaction object
   * @param {Client} client - Client object
   */
  async execute(interaction, client) {
    const { errorEmbed } = client;
    const { user, guild, customId } = interaction;
    // Tách customId lấy amount, fee, targetId
    const [, amountStr, feeStr, targetId] = customId.split(':');
    const amount = parseInt(amountStr, 10);
    const fee = parseInt(feeStr, 10);
    const total = amount + fee;

    // Lấy profile của người chuyển và người nhận
    const [profile, targetProfile] = await Promise.all([
      economyProfile.findOne({ guildID: guild.id, userID: user.id }).catch(console.error),
      economyProfile.findOne({ guildID: guild.id, userID: targetId }).catch(console.error),
    ]);

    // Kiểm tra lại dữ liệu
    if (!profile)
      return await interaction.update(errorEmbed({ description: 'Không kết nối được với database', emoji: false }));
    if (!targetProfile)
      await economyProfile
        .create({
          guildID: guild.id,
          guildName: guild.name,
          userID: targetId,
          bank: 0,
        })
        .catch(console.error);
    if (amount > profile.bank)
      return await interaction.update(errorEmbed({ description: 'Bạn không có đủ \\💲 để chuyển', emoji: false }));

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
        `\\♻️ Bạn đã chuyển **${amount.toLocaleString()}\\💲** cho <@${targetId}>.\n\n\\💵 Phí giao dịch: **${fee.toLocaleString()}\\💲**\n\n\\💸 Tổng trừ: **${total.toLocaleString()}\\💲**\n\n\\🏦 Số dư còn lại: **${profile.bank.toLocaleString()}\\💲**`,
      )
      .setColor('Green')
      .setThumbnail(cfg.economyPNG)
      .setTimestamp()
      .setFooter({ text: `Requested by ${user.displayName || user.username}`, iconURL: user.displayAvatarURL(true) });

    // Tạo embed thông báo cho người nhận
    const embedReceiver = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL(true) })
      .setTitle('Bạn vừa nhận được tiền!')
      .setDescription(
        `Bạn vừa nhận được **${amount.toLocaleString()}\\💲** từ <@${user.id}> trong guild ${
          guild.name
        }.\n\n\\🏦 Số dư mới: **${targetProfile.bank.toLocaleString()}\\💲**`,
      )
      .setColor('Green')
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
      // Nếu không gửi được DM thì bỏ qua
      console.error(chalk.red('Cannot send DM to user'), e);
    }

    // Cập nhật lại interaction cho người chuyển
    return await interaction.update({ embeds: [embedSender], components: [] });
  },
};
