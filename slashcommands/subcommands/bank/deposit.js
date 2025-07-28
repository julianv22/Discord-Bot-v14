const { Client, Interaction, SlashCommandSubcommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const economyProfile = require('../../../config/economyProfile');

module.exports = {
  category: 'sub command',
  scooldown: 0,
  parent: 'bank',
  data: new SlashCommandSubcommandBuilder().setName('deposit'),
  /** - Deposit money into your bank account.
   * @param {Interaction} interaction - Command Interaction
   * @param {Client} client - Discord Client */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });

    const { guildId, user, options } = interaction;
    const { embedMessage, user: bot } = client;
    const userId = user.id;
    const amount = options.getInteger('amount');

    if (amount <= 0) return await interaction.editReply(embedMessage({ desc: 'Số 💲 gửi phải lớn hơn 0!' }));

    const profile = await economyProfile.findOne({ guildId, userId }).catch(console.error);
    if (!profile)
      return await interaction.editReply(
        embedMessage({ title: 'Bạn chưa có tài khoản Economy!', desc: '➡ Sử dụng `daily` để khởi nghiệp 😁' })
      );

    if (amount > profile?.balance)
      return await interaction.editReply(
        embedMessage({
          title: 'Số 💲 gửi không được lớn hơn số tiền hiện có!',
          desc: '➡ Sử dụng /balance để kiểm tra số 💲 hiện có',
        })
      );

    profile.balance -= amount;
    profile.bank += amount;
    await profile.save().catch(console.error);

    const embeds = [
      new EmbedBuilder()
        .setColor(Colors.DarkGreen)
        .setThumbnail(cfg.coin_gif)
        .setAuthor({
          name: user.displayName || user.username,
          iconURL: cfg.money_wings_gif,
        })
        .setTitle('\\🏦 Deposit')
        .setDescription(`\\✅ Gửi ${amount.toCurrency()} vào ngân hàng thành công!\n\n**Số dư hiện có:**`)
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
