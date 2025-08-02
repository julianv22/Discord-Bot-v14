const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');
const { embedMessage } = require('../../../functions/common/logging');

module.exports = {
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  data: new SlashCommandSubcommandBuilder().setName('withdraw'),
  /** - Withdraw money from your bank account.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { user, guildId } = interaction;
    const { user: bot } = client;
    const userId = user.id;
    const amount = interaction.options.getInteger('amount');

    const profile = await economyProfile.findOne({ guildId, userId }).catch(console.error);
    if (!profile)
      return await interaction.editReply(
        embedMessage({ title: 'Bạn chưa có tài khoản Economy!', desc: '➡ Sử dụng /daily để khởi nghiệp 😁' })
      );

    if (amount > profile?.bank)
      return await interaction.editReply(embedMessage({ desc: 'Số 💲 rút không được lớn hơn số tiền hiện có!' }));

    profile.bank -= amount;
    const fee = Math.floor(amount * 0.01);
    profile.balance += amount - fee;
    await profile.save().catch(console.error);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGold)
        .setThumbnail(cfg.coin_gif)
        .setAuthor({
          name: user.displayName || user.username,
          iconURL: cfg.money_wings_gif,
        })
        .setTitle('\\🏦 Withdraw')
        .setDescription(
          `\u2705\uFE0F Rút ${amount.toCurrency()} thành công!\n\nBạn bị trừ ${fee.toCurrency()} (1%) phí rút tiền còn ${(
            amount - fee
          ).toCurrency()}.\n\n**Số dư hiện có:**`
        )
        .setFooter({ text: 'Rất hân hạn được phục vụ bạn!', iconURL: bot.displayAvatarURL(true) })
        .setTimestamp()
        .setFields(
          {
            name: '\\💰 Balance',
            value: profile?.balance.toCurrency(),
            inline: true,
          },
          {
            name: '\\🏦 Bank',
            value: profile?.bank.toCurrency(),
            inline: true,
          }
        ),
    ];

    return await interaction.editReply({ embeds });
  },
};
